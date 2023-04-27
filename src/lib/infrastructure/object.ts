import { Delta } from '../index'
import { IObjectHelper, IHttpHelper, IValidator } from '../application'
import { Service, Autowired } from '../domain'

@Service('helper.obj')
export class ObjectHelper implements IObjectHelper {
	@Autowired('helper.http')
	private http!:IHttpHelper

	@Autowired('helper.val')
	private validator!:IValidator

	public clone (obj:any):any {
		return obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj
	}

	public extends (obj: any, base: any, excludes:string[] = []):any {
		if (obj === null || obj === undefined) {
			return base
		}
		if (base === null || base === undefined) {
			return obj
		}
		return this._extends(this.clone(obj), base, excludes)
	}

	private _extends (obj: any, base: any, excludes:string[]) {
		if (base === undefined || base === null) {
			return obj
		} else if (Array.isArray(base)) {
			if (base.length === 0) {
				return obj
			}
			if (!Array.isArray(obj)) {
				return base
			}
			if (Array.isArray(base[0])) {
				throw new Error('extends array of array not supported')
			}
			for (const itemBase of base) {
				const index = obj.findIndex((p:any) => p.name === itemBase.name)
				if (index === -1) {
					obj.push(this.clone(itemBase))
				} else {
					this._extends(obj[index], itemBase, excludes)
				}
			}
		} else if (typeof base === 'object') {
			for (const entry of Object.entries(base)) {
				const name = entry[0]
				const value = entry[1]
				if (value === undefined || value === null || excludes.includes(name)) {
					continue
				}
				if (obj[name] === undefined) {
					obj[name] = this.clone(value)
				} else if (typeof obj[name] === 'object') {
					this._extends(obj[name], value, excludes)
				}
			}
		}
		return obj
	}

	public names (value:string):string[] {
		if (value === '.') {
			// in case "".[0].name" where var is "."
			return [value]
		} else if (value.startsWith('..')) {
			// in case ".name.filter"
			return ['.'].concat(value.substring(2).split('.'))
		} else if (value.startsWith('.')) {
			// in case ".name.filter"
			return ['.'].concat(value.substring(1).split('.'))
		} else {
			return value.split('.')
		}
	}

	public getValue (source:any, _name:string) :any
	public getValue (source:any, _name:string[]) :any
	public getValue (source:any, _name:string|string[]) :any {
		const names = Array.isArray(_name) ? _name : this.names(_name)
		let value = source
		for (const name of names) {
			if (Array.isArray(value)) {
				// Example: orders.0.number
				if (this.validator.isPositiveInteger(name)) {
					const index = parseInt(name)
					value = value[index]
					continue
				}
				let result:any[] = []
				for (const item of value) {
					if (item[name] !== undefined) {
						if (Array.isArray(item[name])) {
							result = result.concat(item[name])
						} else {
							result.push(item[name])
						}
					}
				}
				value = result
			} else if (value[name] === undefined) {
				return null
			} else {
				value = value[name]
			}
		}
		return value
	}

	public setValue (source:any, name:string, value:any):boolean
	public setValue (source:any, name:string[], value:any):boolean
	public setValue (source:any, name:string|string[], value:any):boolean {
		const names = Array.isArray(name) ? name : name.split('.')
		const level = names.length - 1
		let data = source
		for (let i = 0; i < names.length; i++) {
			const name = names[i]
			// if is an array and name is a positive integer
			if (Array.isArray(data) && this.validator.isPositiveInteger(name)) {
				const index = Number(name)
				// If the index exceeds the length of the array, nothing assigns it.
				if (index >= data.length) {
					return false
				}
				if (i === level) {
					data[index] = value
				} else {
					data = data[index]
				}
			} else if (i === level) {
				data[name] = value
			} else if (data[name] !== undefined) {
				data = data[name]
			} else {
				return false
			}
		}
		return true
	}

	public sort (source: any):any {
		const target:any = {}
		for (const key of Object.keys(source).sort()) {
			target[key] = source[key]
		}
		return target
	}

	public fromEntries (entries: [string, any][]):any {
		if (!Array.isArray(entries)) {
			return {}
		}
		const obj:any = {}
		for (const element of entries) {
			if (!Array.isArray(element) || element.length !== 2) {
				continue
			}
			obj[element[0]] = element[1]
		}
		return obj
	}

	public jsonPath (obj: any, path:string): any {
		const parts = path.split('/')
		let _current = obj as any
		for (let i = 0; i < parts.length; i++) {
			let part = parts[i]
			part = this.http.decode(part)
			const child = _current[part]
			if (child === undefined) {
				return undefined
			}
			_current = child
		}
		return _current
	}

	public createKey (data:any):string {
		if (data === null) {
			return 'null'
		} else if (Array.isArray(data)) {
			const items:any[] = []
			for (const item of data) {
				items.push(this.createKey(item))
			}
			return `[${items.join(',')}]`.toLowerCase()
		} else if (typeof data === 'object') {
			const values:any[] = []
			for (const entry of Object.entries(data)) {
				values.push(`${entry[0]}:${this.createKey(entry[1])}`)
			}
			return `{${values.join(',')}}`.toLowerCase()
		} else {
			return data
		}
	}

	public find (obj: any, predicate: (value:any)=>boolean): any {
		if (Array.isArray(obj)) {
			for (const item of obj) {
				const found = this.find(item, predicate)
				if (found) {
					return found
				}
			}
		} else if (obj !== null && typeof obj === 'object') {
			if (predicate(obj)) {
				return obj
			}
			for (const property of Object.values(obj)) {
				const found = this.find(property, predicate)
				if (found) {
					return found
				}
			}
		}
		return undefined
	}

	public filter (obj: any, predicate: (value:any)=>boolean): any[] {
		const results:any[] = []
		if (Array.isArray(obj)) {
			for (const item of obj) {
				const found = this.filter(item, predicate)
				if (found.length > 0) {
					results.push(...found)
				}
			}
		} else if (obj !== null && typeof obj === 'object') {
			if (predicate(obj)) {
				results.push(obj)
			}
			for (const property of Object.values(obj)) {
				const found = this.filter(property, predicate)
				if (found.length > 0) {
					results.push(...found)
				}
			}
		}
		return results
	}

	public delta (current:any, old?:any):Delta {
		const delta = new Delta()
		if (current === undefined || current === null) {
			throw new Error('current value can\'t empty')
		}
		for (const name in current) {
			const currentValue = current[name]
			if (old === undefined || old === null) {
				delta.new.push({ name, new: currentValue })
			} else {
				this.deltaValue(name, currentValue, old[name], delta)
			}
		}
		if (old !== undefined || old !== null) {
			for (const name in old) {
				if (current[name] === undefined) {
					delta.remove.push({ name, old: old[name] })
				}
			}
		}
		return delta
	}

	private deltaValue (name:string, currentValue:any, oldValue:any, delta:Delta):void {
		if (oldValue === undefined) {
			delta.new.push({ name, new: currentValue })
		} else if (oldValue === null && currentValue === null) {
			delta.unchanged.push({ name, value: oldValue })
		} else if ((oldValue !== null && currentValue === null) || (oldValue === null && currentValue !== null)) {
			delta.changed.push({ name, new: currentValue, old: oldValue, delta: null })
		} else if (Array.isArray(currentValue)) {
			this.deltaArrayValue(name, currentValue, oldValue, delta)
		} else if (this.validator.isObject(currentValue)) {
			const objectDelta = this.delta(currentValue, oldValue)
			const change = objectDelta.changed.length + objectDelta.remove.length + objectDelta.new.length > 0
			if (change) {
				delta.changed.push({ name, new: currentValue, old: oldValue, delta: objectDelta })
			} else {
				delta.unchanged.push({ name, value: oldValue })
			}
		} else if (oldValue !== currentValue) {
			delta.changed.push({ name, new: currentValue, old: oldValue, delta: null })
		} else {
			delta.unchanged.push({ name, value: oldValue })
		}
	}

	private deltaArrayValue (name:string, currentValue:any, oldValue:any, delta:Delta):void {
		if (!Array.isArray(oldValue)) { throw new Error(`current value in ${name} is array by old no`) }
		if (currentValue.length === 0 && oldValue.length === 0) {
			delta.unchanged.push({ name, value: oldValue })
		}
		const arrayDelta = new Delta()
		const news = currentValue.filter((p:any) => oldValue.indexOf(p) === -1)
		const unchanged = currentValue.filter((p:any) => oldValue.indexOf(p) !== -1)
		const removes = oldValue.filter(p => currentValue.indexOf(p) === -1)
		const change = news.length + removes.length > 0
		for (const p in news) {
			arrayDelta.new.push({ name: p, new: p })
		}
		for (const p in removes) {
			arrayDelta.remove.push({ name: p, old: p })
		}
		for (const p in unchanged) {
			arrayDelta.unchanged.push({ name: p, value: p })
		}
		delta.children.push({ name, type: 'array', change, delta: arrayDelta })
	}
}

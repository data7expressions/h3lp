import { Delta, DeltaOptions } from '../index'
import { IObjectHelper, IHttpHelper, IValidator, ObjectEqualOptions } from '../application'

export class ObjectHelper implements IObjectHelper {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly http:IHttpHelper, private readonly validator:IValidator) {}

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

	getKeyProperty (sources:any, alternatives:string[] = ['id', 'code', 'name', 'key']):string|undefined {
		const propertiesName = Object.keys(sources).map(p => p.toLowerCase())
		for (const alternative of alternatives) {
			if (propertiesName.includes(alternative.toLowerCase())) {
				return alternative
			}
		}
		return undefined
	}

	public sort (source: any):any {
		const target:any = {}
		if (source === null) {
			return null
		} else if (Array.isArray(source)) {
			const propertyKey = this.getKeyProperty(source[0])
			if (propertyKey) {
				const result = source.map((p:any) => this.sort(p)).sort((a:any, b:any) => a[propertyKey] > b[propertyKey] ? 1 : -1)
				return result
			} else {
				const result = source.map((p:any) => this.sort(p)).sort((a:any, b:any) => JSON.stringify(a) > JSON.stringify(b) ? 1 : -1)
				return result
			}
		} else if (typeof source === 'object') {
			for (const key of Object.keys(source).sort()) {
				if (source[key] === null) {
					target[key] = null
				} else if (Array.isArray(source[key])) {
					target[key] = this.sort(source[key])
				} else if (typeof source[key] === 'object') {
					target[key] = this.sort(source[key])
				} else {
					target[key] = source[key]
				}
			}
		}
		return target
	}

	public equal (a:any, b:any, options:ObjectEqualOptions): boolean {
		if (!options.strict) {
			const _a = this.sort(a)
			const _b = this.sort(b)
			return JSON.stringify(_a) === JSON.stringify(_b)
		} else {
			return JSON.stringify(a) === JSON.stringify(b)
		}
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

	public delta (current:any, old?:any, options?: DeltaOptions):Delta {
		return this._delta('', current, old, options)
	}

	private _delta (path:string, current:any, old?:any, options?: DeltaOptions):Delta {
		const delta = new Delta()
		if (current === undefined || current === null) {
			throw new Error('current value can\'t empty')
		}
		if (typeof current !== 'object') {
			if (!(options && options.ignore && options.ignore.includes(path))) {
				this._deltaValue(path, '', current, old, delta, options || {})
			}
		} else if (Array.isArray(current)) {
			if (!(options && options.ignore && options.ignore.includes(path))) {
				this._deltaArray(path, '', current, old, delta, options || {})
			}
		} else {
			for (const name in current) {
				const _path = path === '' ? name : `${path}.${name}`
				if (options && options.ignore && options.ignore.includes(_path)) {
					continue
				}
				const currentValue = current[name]
				if (old === undefined || old === null) {
					if (delta.new === undefined) delta.new = []
					delta.new.push({ name, new: currentValue })
				} else {
					this._deltaValue(path === '' ? name : `${path}.${name}`, name, currentValue, old[name], delta, options || {})
				}
			}
			if (old !== undefined || old !== null) {
				for (const name in old) {
					const _path = path === '' ? name : `${path}.${name}`
					if (options && options.ignore && options.ignore.includes(_path)) {
						continue
					}
					if (current[name] === undefined) {
						if (delta.remove === undefined) delta.remove = []
						delta.remove.push({ name, old: old[name] })
					}
				}
			}
		}
		return delta
	}

	private _deltaValue (path:string, name:string, currentValue:any, oldValue:any, delta:Delta, options: DeltaOptions):void {
		if (oldValue === undefined) {
			if (delta.new === undefined) delta.new = []
			delta.new.push({ name, new: currentValue })
		} else if (oldValue === null && currentValue === null) {
			if (delta.unchanged === undefined) delta.unchanged = []
			delta.unchanged.push({ name, value: oldValue })
		} else if ((oldValue !== null && currentValue === null) || (oldValue === null && currentValue !== null)) {
			if (delta.changed === undefined) delta.changed = []
			delta.changed.push({ name, new: currentValue, old: oldValue })
		} else if (Array.isArray(currentValue)) {
			this._deltaArray(path, name, currentValue, oldValue, delta, options)
		} else if (this.validator.isObject(currentValue)) {
			const objectDelta = this._delta(path, currentValue, oldValue, options)
			const change = this._deltaChange(objectDelta)
			if (change) {
				if (delta.changed === undefined) delta.changed = []
				delta.changed.push({ name, new: currentValue, old: oldValue, delta: objectDelta })
			} else {
				if (delta.unchanged === undefined) delta.unchanged = []
				delta.unchanged.push({ name, value: oldValue })
			}
		} else if (oldValue !== currentValue) {
			if (delta.changed === undefined) delta.changed = []
			delta.changed.push({ name, new: currentValue, old: oldValue })
		} else {
			if (delta.unchanged === undefined) delta.unchanged = []
			delta.unchanged.push({ name, value: oldValue })
		}
	}

	private _deltaArray (path:string, name:string, current:any[], old:any[], delta:Delta, options: DeltaOptions):void {
		if (current && Array.isArray(current) && (!old || !Array.isArray(old))) {
			const arrayDelta = new Delta()
			arrayDelta.new = current.map((p, i) => ({ name: i.toString(), new: p }))
			if (delta.children === undefined) delta.children = []
			delta.children.push({ name, type: 'array', change: true, delta: arrayDelta })
		} else if (old && Array.isArray(old) && (!current || !Array.isArray(current))) {
			const arrayDelta = new Delta()
			arrayDelta.remove = old.map((p, i) => ({ name: i.toString(), old: p }))
			if (delta.children === undefined) delta.children = []
			delta.children.push({ name, type: 'array', change: true, delta: arrayDelta })
		} else if (current.length === 0 && old.length === 0) {
			if (delta.unchanged === undefined) delta.unchanged = []
			delta.unchanged.push({ name, value: old })
		} else if (current.length > 0 && typeof current[0] !== 'object') {
			const arrayDelta = new Delta()
			const news = current.filter((p:any) => old.indexOf(p) === -1)
			const unchanged = current.filter((p:any) => old.indexOf(p) !== -1)
			const removes = old.filter(p => current.indexOf(p) === -1)
			for (const p of news) {
				if (arrayDelta.new === undefined) arrayDelta.new = []
				arrayDelta.new.push({ name: current.indexOf(p).toString(), new: p })
			}
			for (const p of removes) {
				if (arrayDelta.remove === undefined) arrayDelta.remove = []
				arrayDelta.remove.push({ name: old.indexOf(p).toString(), old: p })
			}
			for (const p of unchanged) {
				if (arrayDelta.unchanged === undefined) arrayDelta.unchanged = []
				arrayDelta.unchanged.push({ name: current.indexOf(p).toString(), value: p })
			}
			const change = news.length + removes.length > 0
			if (delta.children === undefined) delta.children = []
			delta.children.push({ name, type: 'array', change, delta: arrayDelta })
		} else if (Array.isArray(current[0])) {
			throw new Error(`array of array not supported in ${name}`)
		} else {
			const arrayDelta = this._deltaArrayOfObject(path, name, current, old, options)
			const change = this._deltaChange(arrayDelta)
			if (delta.children === undefined) delta.children = []
			delta.children.push({ name, type: 'array', change, delta: arrayDelta })
		}
	}

	private _deltaArrayOfObject (path:string, name:string, current:any[], old:any[], options: DeltaOptions):Delta {
		const key = Object.keys(current[0]).find(p => ['id', 'code', 'name', 'key'].includes(p.toLowerCase()))
		if (key === undefined) {
			throw new Error(`key not found in ${path}`)
		}
		const arrayDelta = new Delta()
		for (const item of current) {
			const oldItem = old.find((p:any) => p[key] === item[key])
			if (oldItem === undefined) {
				if (arrayDelta.new === undefined) arrayDelta.new = []
				arrayDelta.new.push({ name, new: item })
			} else {
				const objectDelta = this._delta(path, item, oldItem, options)
				const change = this._deltaChange(objectDelta)
				if (change) {
					if (arrayDelta.changed === undefined) arrayDelta.changed = []
					arrayDelta.changed.push({ name, new: item, old: oldItem, delta: objectDelta })
				} else {
					if (arrayDelta.unchanged === undefined) arrayDelta.unchanged = []
					arrayDelta.unchanged.push({ name, value: oldItem })
				}
			}
		}
		for (const item of old) {
			if (current.find((p:any) => p[key] === item[key]) === undefined) {
				if (arrayDelta.remove === undefined) arrayDelta.remove = []
				arrayDelta.remove.push({ name, old: item })
			}
		}
		return arrayDelta
	}

	private _deltaChange (delta:Delta): boolean {
		const main = (delta.changed ? delta.changed.length : 0) + (delta.remove ? delta.remove.length : 0) + (delta.new ? delta.new.length : 0) > 0
		if (main) {
			return true
		} else if (delta.children) {
			for (const child of delta.children) {
				if (child.change) {
					return true
				}
			}
			return false
		} else {
			return false
		}
	}
}

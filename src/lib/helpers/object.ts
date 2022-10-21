import { HttpHelper } from './http'
import { Validator } from './validator'
export class ObjectHelper {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly http: HttpHelper, private readonly validator: Validator) { }

	public clone (obj:any):any {
		return obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj
	}

	public extends (obj: any, base: any) {
		if (Array.isArray(base)) {
			for (const baseChild of base) {
				const objChild = obj.find((p: any) => p.name === baseChild.name)
				if (objChild === undefined) {
					obj.push(this.clone(baseChild))
				} else {
					this.extends(objChild, baseChild)
				}
			}
		} else if (typeof base === 'object') {
			for (const entry in Object.entries(base)) {
				if (entry[1] === undefined) {
					obj[entry[0]] = this.clone(base[entry[0]])
				} else if (typeof obj[entry[0]] === 'object') {
					this.extends(obj[entry[0]], base[entry[0]])
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

	public getValue (source:any, name:string) :any {
		const names = this.names(name)
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
			} else {
				if (value[name] === undefined) {
					return null
				}
				value = value[name]
			}
		}
		return value
	}

	public setValue (source:any, name:string, value:any):void {
		const names = name.split('.')
		const level = names.length - 1
		let data = source
		for (let i = 0; i < names.length; i++) {
			const name = names[i]
			// if is an array and name is a positive integer
			if (Array.isArray(data) && this.validator.isPositiveInteger(name)) {
				const index = Number(name)
				// If the index exceeds the length of the array, nothing assigns it.
				if (index >= data.length) {
					return
				}
				if (i === level) {
					data[index] = value
				} else {
					data = data[index]
				}
			} else {
				if (i === level) {
					data[name] = value
				} else {
					data = data[name]
				}
			}
		}
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
}

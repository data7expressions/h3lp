
export class ObjectHelper {
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
			for (const k in base) {
				if (obj[k] === undefined) {
					obj[k] = this.clone(base[k])
				} else if (typeof obj[k] === 'object') {
					this.extends(obj[k], base[k])
				}
			}
		}
		return obj
	}

	public getNames (value:string):string[] {
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

	public getValue (names:string[], source:any) :any {
		let value = source
		for (const name of names) {
			if (Array.isArray(value)) {
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
				if (value[name] === undefined) return null
				value = value[name]
			}
		}
		return value
	}

	public sortObject (source: any):any {
		const target:any = {}
		for (const key of Object.keys(source).sort()) {
			target[key] = source[key]
		}
		return target
	}

	public fromEntries (array: any[]):any {
		if (!Array.isArray(array)) {
			return {}
		}
		const obj:any = {}
		for (const element of array) {
			if (!Array.isArray(element) || element.length !== 2) {
				continue
			}
			obj[element[0]] = element[1]
		}
		return obj
	}
}

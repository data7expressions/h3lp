export class Validator {
	public isObject (obj:any):boolean {
		return obj && typeof obj === 'object' && obj.constructor === Object && !Array.isArray(obj)
	}

	public isEmpty (value:any):boolean {
		return value === null || value === undefined || value.toString().trim().length === 0
	}

	public isPositiveInteger (value:any) {
		if (typeof value !== 'string') {
			return false
		}
		const num = Number(value)
		return Number.isInteger(num) && num >= 0
	}

	public isNull (value: any): boolean {
		return value === undefined || value === null
	}

	public isNotNull (value: any): boolean {
		return !this.isNull(value)
	}

	public isNotEmpty (value: string): boolean {
		return !this.isEmpty(value)
	}

	public isBoolean (value: any): boolean {
		return typeof value === 'boolean'
	}

	public isNumber (value: any): boolean {
		return this.isDecimal(value)
	}

	public isInteger (value: any): boolean {
		return Number.isInteger(value)
	}

	public isDecimal (value: any): boolean {
		return !isNaN(value)
	}

	public isString (value: any): boolean {
		return typeof value === 'string'
	}

	public isDate (value: any): boolean {
		if (typeof value === 'string') {
			return this.isDateFormat(value as string)
		} else {
			return typeof value.getMonth === 'function'
		}
	}

	public isDateTime (value: any): boolean {
		if (typeof value === 'string') {
			return this.isDateTimeFormat(value as string)
		} else {
			return typeof value.getMonth === 'function'
		}
	}

	public isArray (value: any): boolean {
		return Array.isArray(value)
	}

	public isTime (value: any): boolean {
		if (typeof value === 'string') {
			return this.isTimeFormat(value as string)
		} else {
			return typeof value.getMonth === 'function'
		}
	}

	public isBooleanFormat (value: any): boolean {
		return ['true', 'false'].includes(value)
	}

	public isNumberFormat (value: any): boolean {
		return this.isDecimalFormat(value)
	}

	public isIntegerFormat (value: any): boolean {
		const regex = /^\d+$/
		return value.match(regex) !== null
	}

	public isDecimalFormat (value: any): boolean {
		const regex = /^\d+\.\d+$/
		return value.match(regex) !== null
	}

	public isStringFormat (value: any): boolean {
		const regex = /[a-zA-Z0-9_.]+$/
		return value.match(regex) !== null
	}

	public isDateFormat (value: any): boolean {
		const regex = /^\d{4}-\d{2}-\d{2}$/
		return value.match(regex) !== null
	}

	public isDateTimeFormat (value: any): boolean {
		const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
		return value.match(regex) !== null
	}

	public isTimeFormat (value: any): boolean {
		// https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
		const regex = /\[0-2]\d:[0-5]\d:[0-5]\d/
		return value.match(regex) !== null
	}
}

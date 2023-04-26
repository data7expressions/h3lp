export interface IValidator {
	isObject (obj:any):boolean
	isEmpty (value:any):boolean
	isPositiveInteger (value:any): boolean
	isNull (value: any): boolean
	isNotNull (value: any): boolean
	isNotEmpty (value: string): boolean
	isBoolean (value: any): boolean
	isNumber (value: any): boolean
	isInteger (value: any): boolean
	isDecimal (value: any): boolean
	isString (value: any): boolean
	isDate (value: any): boolean
	isDateTime (value: any): boolean
	isArray (value: any): boolean
	isTime (value: any): boolean
	isBooleanFormat (value: any): boolean
	isNumberFormat (value: any): boolean
	isIntegerFormat (value: string): boolean
	isDecimalFormat (value: string): boolean
	isAlphanumeric (value: string): boolean
	isAlpha (value: string): boolean
	isDateFormat (value: string): boolean
	isDateTimeFormat (value: string): boolean
	isTimeFormat (value: string): boolean
	between (value: any, from: any, to: any): boolean
	includes (list: any[]|string, value: any): boolean
}

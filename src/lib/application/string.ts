import { NormalizeOptions } from '../domain/base'

export interface EqualOptions {
	ignoreCase?: boolean
	normalize?: boolean
}

export interface IStringHelper {
	toString (value: any): string
	replace (string: string, search: string, replace: string):string
	concat (values: any[]): any
	capitalize(str: string): string
	initCap (str: string): string
	normalize (source: string, options?: NormalizeOptions): string
	plural (word: string, amount?: number): string
	singular (word: string, amount?: number): string
	notation (str: string, type?:'camel'|'pascal'): string
	isUpperCase (char: string): boolean
	isLowerCase (char: string): boolean
	isDigit (char: string): boolean
	equal(a:string, b:string, options:EqualOptions): boolean
}

import { NormalizeOptions } from '../domain/base'

export interface IStringHelper {
toString (value: any): string
replace (string: string, search: string, replace: string):string
concat (values: any[]): any
capitalize(str: string): string
initCap (str: string): string
normalize (source: string, options?: NormalizeOptions): string
plural (word: string, amount?: number): string
singular (word: string, amount?: number): string
}

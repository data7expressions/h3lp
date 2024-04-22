import { Delta, DeltaOptions } from '../domain'

export interface ObjectEqualOptions {
	strict?: boolean
}
export interface IObjectHelper {
	clone (obj:any):any
	extends (obj: any, base: any, excludes?:string[]):any
	names (value:string):string[]
	getValue (source:any, _name:string) :any
	getValue (source:any, _name:string[]) :any
	getValue (source:any, _name:string|string[]) :any
	setValue (source:any, name:string, value:any):boolean
	setValue (source:any, name:string[], value:any):boolean
	setValue (source:any, name:string|string[], value:any):boolean
	sort (source: any):any
	fromEntries (entries: [string, any][]):any
	jsonPath (obj: any, path:string): any
	createKey (data:any):string
	getKeyProperty (sources:any, alternatives?:string[]):string|undefined
	find (obj: any, predicate: (value:any)=>boolean): any
	filter (obj: any, predicate: (value:any)=>boolean): any[]
	delta (current:any, old?:any, options?: DeltaOptions):Delta
	equal (a:any, b:any, options:ObjectEqualOptions): boolean
}

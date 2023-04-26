import { IReplacer } from '../domain'

export interface IContextReplacer extends IReplacer {
	context (context: any): IContextReplacer
}

export interface IUtils {
	getType (value: any): string
	exec (command: string, cwd: string): Promise<any>
	toNumber (value: any): number
	randomInteger (min:number, max:number): number
	nvl (value: any, _default: any): any
	nvl2 (value: any, a: any, b: any): any
	tryParse (value: string): any | null
	sleep (ms:number): Promise<void>
	hashCode (text: string): number
	// eslint-disable-next-line @typescript-eslint/ban-types
	isAsync (func:Function): boolean
	solveEnvironmentVars (source: any): any
	createEnvironmentVariableReplacer ():IReplacer
	createContextReplacer () :IContextReplacer
	template (template: any, replacer: IReplacer | any, parse?:boolean): string
	implementReplacer (replacer: any): boolean
}

import { Helper } from './helper'
import { Validator } from './validator'
import { FsHelper } from './fs'
import { HttpHelper } from './http'
import { ObjectHelper } from './object'
import { EnvironmentHelper } from './environment'
import { DeltaHelper } from './delta'
import { Delta } from '../index'

export class H3lp {
	private helper:Helper
	private validator:Validator
	private fs:FsHelper
	private http:HttpHelper
	private obj:ObjectHelper
	private environment:EnvironmentHelper
	private delta:DeltaHelper
	constructor () {
		this.validator = new Validator()
		this.helper = new Helper(this.validator)
		this.fs = new FsHelper()
		this.http = new HttpHelper(this.helper)
		this.obj = new ObjectHelper()
		this.environment = new EnvironmentHelper(this.helper)
		this.delta = new DeltaHelper(this.validator)
	}

	public async get (uri: any): Promise<any> {
		return this.http.get(uri)
	}

	public decodeUrl (source:string) {
		return this.http.decodeUrl(source)
	}

	public urlJoin (source:string, path:string) : string {
		return this.http.urlJoin(source, path)
	}

	public getType (value: any): string {
		return this.helper.getType(value)
	}

	public async exec (command: string, cwd: string = process.cwd()): Promise<any> {
		return this.helper.exec(command, cwd)
	}

	public replace (string:string, search:string, replace:string) {
		return this.helper.replace(string, search, replace)
	}

	public nvl (value:any, _default:any):any {
		return this.helper.nvl(value, _default)
	}

	public nvl2 (value: any, a: any, b: any): any {
		return this.helper.nvl2(value, a, b)
	}

	public tryParse (value:string):any|null {
		return this.helper.tryParse(value)
	}

	public async sleep (ms = 1000): Promise<void> {
		return this.helper.sleep(ms)
	}

	public clone (obj:any):any {
		return this.obj.clone(obj)
	}

	public extends (obj: any, base: any) {
		return this.obj.extends(obj, base)
	}

	public getNames (value:string):string[] {
		return this.obj.getNames(value)
	}

	public getValue (names:string[], source:any) :any {
		return this.obj.getValue(names, source)
	}

	public sortObject (source: any):any {
		return this.obj.sortObject(source)
	}

	public fromEntries (array: any[]):any {
		return this.obj.fromEntries(array)
	}

	public isObject (obj:any):boolean {
		return this.validator.isObject(obj)
	}

	public isEmpty (value:any):boolean {
		return this.validator.isEmpty(value)
	}

	public isNull (value: any): boolean {
		return this.validator.isNull(value)
	}

	public isNotNull (value: any): boolean {
		return this.validator.isNotNull(value)
	}

	public isNotEmpty (value: string): boolean {
		return this.validator.isNotEmpty(value)
	}

	public isBoolean (value: any): boolean {
		return this.validator.isBoolean(value)
	}

	public isNumber (value: any): boolean {
		return this.validator.isNumber(value)
	}

	public isInteger (value: any): boolean {
		return this.validator.isInteger(value)
	}

	public isDecimal (value: any): boolean {
		return this.validator.isDecimal(value)
	}

	public isString (value: any): boolean {
		return this.validator.isString(value)
	}

	public isDate (value: any): boolean {
		return this.validator.isDate(value)
	}

	public isDateTime (value: any): boolean {
		return this.validator.isDateTime(value)
	}

	public isArray (value: any): boolean {
		return this.validator.isArray(value)
	}

	public isTime (value: any): boolean {
		return this.validator.isTime(value)
	}

	public isBooleanFormat (value: any): boolean {
		return this.validator.isBooleanFormat(value)
	}

	public isNumberFormat (value: any): boolean {
		return this.validator.isNumberFormat(value)
	}

	public isIntegerFormat (value: any): boolean {
		return this.validator.isIntegerFormat(value)
	}

	public isDecimalFormat (value: any): boolean {
		return this.validator.isDecimalFormat(value)
	}

	public isStringFormat (value: any): boolean {
		return this.validator.isStringFormat(value)
	}

	public isDateFormat (value: any): boolean {
		return this.validator.isDateFormat(value)
	}

	public isDateTimeFormat (value: any): boolean {
		return this.validator.isDateTimeFormat(value)
	}

	public isTimeFormat (value: any): boolean {
		return this.validator.isTimeFormat(value)
	}

	public between (value: any, from: any, to: any): boolean {
		return this.validator.between(value, from, to)
	}

	public includes (list: any[]|string, value: any): boolean {
		return this.validator.includes(list, value)
	}

	public async existsPath (sourcePath:string):Promise<boolean> {
		return this.fs.existsPath(sourcePath)
	}

	public async createIfNotExists (sourcePath:string):Promise<void> {
		return this.fs.createIfNotExists(sourcePath)
	}

	public resolvePath (source:string):string {
		return this.fs.resolvePath(source)
	}

	public async readFile (filePath: string): Promise<string|null> {
		return this.fs.resolvePath(filePath)
	}

	public async removeFile (path:string):Promise<void> {
		return this.fs.removeFile(path)
	}

	public async copyFile (src: string, dest:string): Promise<void> {
		return this.fs.copyFile(src, dest)
	}

	public async writeFile (path: string, content: string): Promise<void> {
		return this.fs.writeFile(path, content)
	}

	public async mkdir (path:string):Promise<void> {
		return this.fs.mkdir(path)
	}

	public async lstat (path:string):Promise<any> {
		return this.fs.lstat(path)
	}

	public getEnvironmentVariable (text:string):string|undefined {
		return this.environment.getEnvironmentVariable(text)
	}

	public solveEnvironmentVariables (source:any): void {
		return this.environment.solveEnvironmentVariables(source)
	}

	public isPositiveInteger (value:any) {
		return this.validator.isPositiveInteger(value)
	}

	public deltaWithSimpleArrays (current:any, old?:any):Delta {
		return this.delta.deltaWithSimpleArrays(current, old)
	}
}

export interface IHttpHelper {
	get (uri: any): Promise<any>
	decode (source:string):string
	urlJoin (source:string, path:string) : string
}

import { Utils } from './utils'
import { Validator } from './validator'
import { FsHelper } from './fs'
import { HttpHelper } from './http'
import { ObjectHelper } from './object'
import { EnvHelper } from './env'
import { StringHelper } from './string'
import { DeltaHelper } from './delta'

export class H3lp {
	public utils:Utils
	public validator:Validator
	public fs:FsHelper
	public http:HttpHelper
	public obj:ObjectHelper
	public env:EnvHelper
	public delta:DeltaHelper
	public string:StringHelper
	constructor () {
		this.validator = new Validator()
		this.utils = new Utils(this.validator)
		this.fs = new FsHelper()
		this.delta = new DeltaHelper(this.validator)
		this.string = new StringHelper(this.validator)
		this.http = new HttpHelper(this.string)
		this.obj = new ObjectHelper(this.http)
		this.env = new EnvHelper(this.utils, this.string)
	}
}

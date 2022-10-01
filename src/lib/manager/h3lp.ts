import { Utils, Validator, FsHelper, HttpHelper, ObjectHelper, EnvHelper, StringHelper, DeltaHelper } from './'

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

import { Utils, Validator, FsHelper, HttpHelper, ObjectHelper, StringHelper, DeltaHelper, TestHelper } from '.'

export class H3lp {
	public utils:Utils
	public validator:Validator
	public fs:FsHelper
	public http:HttpHelper
	public obj:ObjectHelper
	public delta:DeltaHelper
	public string:StringHelper
	public test:TestHelper
	constructor () {
		this.validator = new Validator()
		this.string = new StringHelper(this.validator)
		this.http = new HttpHelper(this.string)
		this.obj = new ObjectHelper(this.http, this.validator)
		this.utils = new Utils(this.validator, this.obj)
		this.fs = new FsHelper()
		this.delta = new DeltaHelper(this.validator)
		this.test = new TestHelper(this.string, this.obj, this.utils, this.fs)
	}
}

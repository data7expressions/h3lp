import { Utils, Validator, FsHelper, HttpHelper, ObjectHelper, StringHelper, TestHelper, ArrayHelper } from '.'
export class H3lp {
	public utils:Utils
	public val:Validator
	public fs:FsHelper
	public http:HttpHelper
	public obj:ObjectHelper
	public str:StringHelper
	public test:TestHelper
	public array:ArrayHelper
	constructor () {
		this.val = new Validator()
		this.str = new StringHelper(this.val)
		this.array = new ArrayHelper()
		this.fs = new FsHelper()
		this.http = new HttpHelper(this.str)
		this.obj = new ObjectHelper(this.http, this.val)
		this.utils = new Utils(this.val, this.obj)
		this.test = new TestHelper(this.str, this.obj, this.utils, this.fs)
	}
}

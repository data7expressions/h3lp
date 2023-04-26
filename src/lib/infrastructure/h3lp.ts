import { Utils, Validator, FsHelper, HttpHelper, ObjectHelper, StringHelper, TestHelper, ArrayHelper } from '.'
import { H3lp } from '../application'

export class H3lpSetter {
	public set (help:H3lp):H3lp {
		help.val = new Validator()
		help.str = new StringHelper(help.val)
		help.array = new ArrayHelper()
		help.fs = new FsHelper()
		help.http = new HttpHelper(help.str)
		help.obj = new ObjectHelper(help.http, help.val)
		help.utils = new Utils(help.val, help.obj)
		help.test = new TestHelper(help.str, help.obj, help.utils, help.fs)
		return help
	}
}

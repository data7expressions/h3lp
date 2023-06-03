import { H3lp } from '../application'
import { ArrayHelper } from './array'
import { FsHelper } from './fs'
import { HttpHelper } from './http'
import { ObjectHelper } from './object'
import { StringHelper } from './string'
import { TestHelper } from './test'
import { Utils } from './utils'
import { Validator } from './validator'

export class H3lpBuilder {
	public build ():H3lp {
		const val = new Validator()
		const str = new StringHelper(val)
		const array = new ArrayHelper()
		const fs = new FsHelper()
		const http = new HttpHelper(str)
		const obj = new ObjectHelper(http, val)
		const utils = new Utils(val, obj)
		const test = new TestHelper(utils, fs, str, obj)
		return new H3lp(utils, val, fs, http, obj, str, test, array)
	}
}

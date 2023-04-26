import { IUtils, IValidator, IFsHelper, IHttpHelper, IObjectHelper, IStringHelper, ITestHelper, IArrayHelper } from '.'
export class H3lp {
	private _utils?:IUtils
	private _val?:IValidator
	private _fs?:IFsHelper
	private _http?:IHttpHelper
	private _obj?:IObjectHelper
	private _str?:IStringHelper
	private _test?:ITestHelper
	private _array?:IArrayHelper

	public get utils ():IUtils {
		if (this._utils === undefined) {
			throw new Error('Utils not implemented')
		}
		return this._utils
	}

	public set utils (value:IUtils) {
		this._utils = value
	}

	public get val ():IValidator {
		if (this._val === undefined) {
			throw new Error('Validator not implemented')
		}
		return this._val
	}

	public set val (value:IValidator) {
		this._val = value
	}

	public get fs ():IFsHelper {
		if (this._fs === undefined) {
			throw new Error('Fs Helper not implemented')
		}
		return this._fs
	}

	public set fs (value:IFsHelper) {
		this._fs = value
	}

	public get http ():IHttpHelper {
		if (this._http === undefined) {
			throw new Error('Http Helper not implemented')
		}
		return this._http
	}

	public set http (value:IHttpHelper) {
		this._http = value
	}

	public get obj ():IObjectHelper {
		if (this._obj === undefined) {
			throw new Error('Obj Helper not implemented')
		}
		return this._obj
	}

	public set obj (value:IObjectHelper) {
		this._obj = value
	}

	public get str ():IStringHelper {
		if (this._str === undefined) {
			throw new Error('String Helper not implemented')
		}
		return this._str
	}

	public set str (value:IStringHelper) {
		this._str = value
	}

	public get test ():ITestHelper {
		if (this._test === undefined) {
			throw new Error('Test Helper not implemented')
		}
		return this._test
	}

	public set test (value:ITestHelper) {
		this._test = value
	}

	public get array ():IArrayHelper {
		if (this._array === undefined) {
			throw new Error('Test Helper not implemented')
		}
		return this._array
	}

	public set array (value:IArrayHelper) {
		this._array = value
	}
}
export const h3lp = new H3lp()

import { IUtils, IValidator, IFsHelper, IHttpHelper, IObjectHelper, IStringHelper, ITestHelper, IArrayHelper } from '.'
export class H3lp {
	private static instances:any = {}
	public static add (...instances:any[]):void {
		for (const instance of instances) {
			H3lp._add(instance)
		}
	}

	private static _add (instance:any):void {
		if (instance.__service === undefined) {
			throw new Error('instance not implement Service decorator')
		}
		const names = instance.__service.split('.')
		const level = names.length - 1
		let data = H3lp.instances
		for (let i = 0; i < names.length; i++) {
			const name = names[i]
			if (i === level) {
				data[name] = instance
				return
			}
			if (data[name] === undefined) {
				data[name] = {}
			}
			data = data[name]
		}
	}

	public static get<T> (service:string):T {
		const names = service.split('.')
		let value = H3lp.instances
		for (const name of names) {
			if (value[name] === undefined) {
				throw new Error(`Service ${service} cannot found`)
			} else {
				value = value[name]
			}
		}
		const instance:T = value as T
		if (instance === undefined) {
			throw new Error(`Service ${service} not implemented`)
		}
		return instance
	}

	public get utils ():IUtils {
		return H3lp.get<IUtils>('helper.utils')
	}

	public get val ():IValidator {
		return H3lp.get<IValidator>('helper.val')
	}

	public get fs ():IFsHelper {
		return H3lp.get<IFsHelper>('helper.fs')
	}

	public get http ():IHttpHelper {
		return H3lp.get<IHttpHelper>('helper.http')
	}

	public get obj ():IObjectHelper {
		return H3lp.get<IObjectHelper>('helper.obj')
	}

	public get str ():IStringHelper {
		return H3lp.get<IStringHelper>('helper.str')
	}

	public get test ():ITestHelper {
		return H3lp.get<ITestHelper>('helper.test')
	}

	public get array ():IArrayHelper {
		return H3lp.get<IArrayHelper>('helper.array')
	}
}

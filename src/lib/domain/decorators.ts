/* eslint-disable @typescript-eslint/ban-types */
import { Factory } from './factory'

export function Sealed (constructor: Function) {
	Object.seal(constructor)
	Object.seal(constructor.prototype)
}

export function Service (name:string) {
	return function (constructor: Function) {
		Factory.add(name, Object.create(constructor.prototype))
	}
}

export function Autowired (name: string) {
	return function (target: any, propertyKey: string) {
		let instance : any
		const getter = function () {
			if (instance === undefined) {
				instance = Factory.get(name)
			}
			return instance
		}
		Object.defineProperty(target, propertyKey, {
			get: getter
		})
	}
}

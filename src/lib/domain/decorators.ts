import { Factory } from './factory'

export function Service (name:string) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (constructor: Function) {
		Factory.add(name, constructor.prototype)
	}
}

export function Autowired (name: string) {
	return function (target: any, propertyKey: string) {
		const getter = function () {
			return Factory.get(name)
		}
		Object.defineProperty(target, propertyKey, {
			get: getter
		})
	}
}

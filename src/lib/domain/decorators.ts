import { Factory } from './factory'

export function Service (name:string) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return function (constructor: Function) {
		Factory.add(name, constructor.prototype)
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

import { Sealed } from './decorators'

@Sealed
export class Factory {
	private static instances:any = {}
	public static add (service:string, instance:any):void {
		const names = service.split('.')
		const level = names.length - 1
		let data = Factory.instances
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

	public static get (service:string):any {
		const names = service.split('.')
		let value = Factory.instances
		for (const name of names) {
			if (value[name] === undefined) {
				throw new Error(`Service ${service} cannot found`)
			} else {
				value = value[name]
			}
		}
		return value
	}
}

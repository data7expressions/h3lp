/* eslint-disable @typescript-eslint/ban-types */

export function Service (name:string) {
	return function (constructor: Function) {
		constructor.prototype.__service = name
	}
}

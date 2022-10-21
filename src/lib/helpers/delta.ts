import { Delta } from '../index'
import { Validator } from './validator'

export class DeltaHelper {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly validator:Validator) {}

	public deltaWithSimpleArrays (current:any, old?:any):Delta {
		const delta = new Delta()
		if (current === undefined || current === null) {
			throw new Error('current value can\'t empty')
		}
		for (const name in current) {
			const currentValue = current[name]
			if (old === undefined || old === null) {
				delta.new.push({ name: name, new: currentValue })
			} else {
				this.deltaValue(name, currentValue, old[name], delta)
			}
		}
		if (old !== undefined || old !== null) {
			for (const name in old) {
				if (current[name] === undefined) {
					delta.remove.push({ name: name, old: old[name] })
				}
			}
		}
		return delta
	}

	private deltaValue (name:string, currentValue:any, oldValue:any, delta:Delta):void {
		if (oldValue === undefined) {
			delta.new.push({ name: name, new: currentValue })
		} else if (oldValue === null && currentValue === null) {
			delta.unchanged.push({ name: name, value: oldValue })
		} else if ((oldValue !== null && currentValue === null) || (oldValue === null && currentValue !== null)) {
			delta.changed.push({ name: name, new: currentValue, old: oldValue, delta: null })
		} else if (Array.isArray(currentValue)) {
			this.deltaArrayValue(name, currentValue, oldValue, delta)
		} else if (this.validator.isObject(currentValue)) {
			const objectDelta = this.deltaWithSimpleArrays(currentValue, oldValue)
			const change = objectDelta.changed.length + objectDelta.remove.length + objectDelta.new.length > 0
			if (change) {
				delta.changed.push({ name: name, new: currentValue, old: oldValue, delta: objectDelta })
			} else {
				delta.unchanged.push({ name: name, value: oldValue })
			}
		} else if (oldValue !== currentValue) {
			delta.changed.push({ name: name, new: currentValue, old: oldValue, delta: null })
		} else {
			delta.unchanged.push({ name: name, value: oldValue })
		}
	}

	private deltaArrayValue (name:string, currentValue:any, oldValue:any, delta:Delta):void {
		if (!Array.isArray(oldValue)) { throw new Error(`current value in ${name} is array by old no`) }
		if (currentValue.length === 0 && oldValue.length === 0) {
			delta.unchanged.push({ name: name, value: oldValue })
		}
		const arrayDelta = new Delta()
		const news = currentValue.filter((p:any) => oldValue.indexOf(p) === -1)
		const unchanged = currentValue.filter((p:any) => oldValue.indexOf(p) !== -1)
		const removes = oldValue.filter(p => currentValue.indexOf(p) === -1)
		const change = news.length + removes.length > 0
		for (const p in news) {
			arrayDelta.new.push({ name: p, new: p })
		}
		for (const p in removes) {
			arrayDelta.remove.push({ name: p, old: p })
		}
		for (const p in unchanged) {
			arrayDelta.unchanged.push({ name: p, value: p })
		}
		delta.children.push({ name: name, type: 'array', change: change, delta: arrayDelta })
	}
}

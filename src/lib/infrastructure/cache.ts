import { ICache } from '../domain'

export class MemoryCache<K, T> implements ICache<K, T> {
	// eslint-disable-next-line no-useless-constructor
	public constructor (private readonly map:Map<K, T> = new Map<K, T>()) { }

	public get (key:K):T|undefined {
		return this.map.get(key)
	}

	public set (key:K, value:T):void {
		this.map.set(key, value)
	}

	public delete (key:K):boolean {
		return this.map.delete(key)
	}
}

export interface ICache<K, T> {
	get(key:K): T|undefined
	set(key:K, value:T):void
	delete(key:K):boolean
}

export interface NormalizeOptions {
	toLower?: boolean
	toUpper?: boolean
}

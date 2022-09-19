import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

export class Helper {
	public async get (uri: any): Promise<any> {
		// https://www.geeksforgeeks.org/node-js-https-request-function/
		return new Promise<string>((resolve, reject) => {
			let data = ''
			// https://www.geeksforgeeks.org/node-js-url-method/
			// const _url = new url.URL(uri)
			// const options = {
			// hostname: _url.hostname,
			// port: _url.protocol === 'https' ? 443 : 80,
			// path: _url.pathname,
			// method: 'GET'
			// // https://levelup.gitconnected.com/how-to-resolve-certificate-errors-in-nodejs-app-involving-ssl-calls-781ce48daded
			// // https://levelup.gitconnected.com/how-to-resolve-certificate-errors-in-nodejs-app-involving-ssl-calls-781ce48daded
			// // NO FUNCIONO
			// // rejectUnauthorized: false
			// }
			const protocol = new URL(uri).protocol
			const lib = protocol === 'https:' ? https : http
			const req = lib.request(uri, res => {
				res.on('data', chunk => {
					data = data + chunk.toString()
				})
				res.on('end', () => {
					resolve(data)
				})
			})
			req.on('error', error => {
				reject(error)
			})
			req.end()
		})
	}

	public decodeUrl (source:string) {
		let url = source
		// https://splunktool.com/json-schema-validation-with-escaped-characters-in-patterns-fails
		if (url.includes('~1')) {
			url = this.replace(url, '~1', '/')
		}
		if (url.includes('~0')) {
			url = this.replace(url, '~0', '~')
		}
		// https://www.geeksforgeeks.org/how-to-retain-special-characters-in-expressjs-router-url-request/
		// https://codeforgeek.com/how-to-encode-decode-url-javascript/
		if (url.includes('%')) {
			// part = encodeURI(part)
			url = decodeURI(url)
		}
		return url
	}

	public urlJoin (source:string, path:string) : string {
		const isUri = /(https?:\/\/[^\s]+)/g
		if (isUri.test(source)) {
			return new URL(path, source).href
		}
		const pathParts = path.split('/')
		const sourceParts = source.split('/')
		const newParts = sourceParts.splice(1, sourceParts.length - (pathParts.length + 1))
		return newParts.join('/') + '/' + pathParts.join('/')
	}

	public getType (value: any): string {
		if (Array.isArray(value)) return 'array'
		if (typeof value === 'string') {
			// TODO determinar si es fecha.
			return 'string'
		}
		return typeof value
	}

	public async exec (command: string, cwd: string = process.cwd()): Promise<any> {
		return new Promise<string>((resolve, reject) => {
			exec(command, { cwd: cwd }, (error: any, stdout: any, stderr: any) => {
				if (stdout) return resolve(stdout)
				if (stderr) return resolve(stderr)
				if (error) return reject(error)
				return resolve('')
			})
		})
	}

	public replace (string:string, search:string, replace:string) {
		return string.split(search).join(replace)
	}

	public clone (obj:any):any {
		return obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj
	}

	public extendObject (obj: any, base: any) {
		if (Array.isArray(base)) {
			for (const baseChild of base) {
				const objChild = obj.find((p: any) => p.name === baseChild.name)
				if (objChild === undefined) {
					obj.push(this.clone(baseChild))
				} else {
					this.extendObject(objChild, baseChild)
				}
			}
		} else if (typeof base === 'object') {
			for (const k in base) {
				if (obj[k] === undefined) {
					obj[k] = this.clone(base[k])
				} else if (typeof obj[k] === 'object') {
					this.extendObject(obj[k], base[k])
				}
			}
		}
		return obj
	}

	public getNames (value:string):string[] {
		if (value === '.') {
			// in case "".[0].name" where var is "."
			return [value]
		} else if (value.startsWith('..')) {
			// in case ".name.filter"
			return ['.'].concat(value.substring(2).split('.'))
		} else if (value.startsWith('.')) {
			// in case ".name.filter"
			return ['.'].concat(value.substring(1).split('.'))
		} else {
			return value.split('.')
		}
	}

	public getValue (names:string[], source:any) :any {
		let value = source
		for (const name of names) {
			if (Array.isArray(value)) {
				let result:any[] = []
				for (const item of value) {
					if (item[name] !== undefined) {
						if (Array.isArray(item[name])) {
							result = result.concat(item[name])
						} else {
							result.push(item[name])
						}
					}
				}
				value = result
			} else {
				if (value[name] === undefined) return null
				value = value[name]
			}
		}
		return value
	}

	public sortObject (source: any):any {
		const target:any = {}
		for (const key of Object.keys(source).sort()) {
			target[key] = source[key]
		}
		return target
	}

	public fromEntries (array: any[]):any {
		if (!Array.isArray(array)) {
			return {}
		}
		const obj:any = {}
		for (const element of array) {
			if (!Array.isArray(element) || element.length !== 2) {
				continue
			}
			obj[element[0]] = element[1]
		}
		return obj
	}

	public isObject (obj:any):boolean {
		return obj && typeof obj === 'object' && obj.constructor === Object
	}

	public isEmpty (value:any):boolean {
		return value === null || value === undefined || value.toString().trim().length === 0
	}

	public nvl (value:any, _default:any):any {
		return !this.isEmpty(value) ? value : _default
	}

	public async existsPath (sourcePath:string):Promise<boolean> {
		const fullPath = this.resolvePath(sourcePath)
		return new Promise<boolean>((resolve) => {
			fs.access(fullPath, (err) => {
				if (err) {
					resolve(false)
				} else {
					resolve(true)
				}
			})
		})
	}

	public async createIfNotExists (sourcePath:string):Promise<void> {
		const fullPath = this.resolvePath(sourcePath)
		if (await this.existsPath(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public resolvePath (source:string):string {
		const _source = source.trim()
		if (_source.startsWith('.')) {
			return path.join(process.cwd(), source)
		}
		if (_source.startsWith('~')) {
			return _source.replace('~', process.env.HOME as string)
		}
		return source
	}

	public async readFile (filePath: string): Promise<string|null> {
		const fullPath = this.resolvePath(filePath)
		if (!await this.existsPath(fullPath)) {
			return null
		}
		return new Promise<string>((resolve, reject) => {
			fs.readFile(fullPath, (err, data) => err ? reject(err) : resolve(data.toString('utf8')))
		})
	}

	public async removeFile (fullPath:string):Promise<void> {
		if (!await this.existsPath(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.unlink(fullPath, err => err ? reject(err) : resolve())
		})
	}

	public async copyFile (src: string, dest:string): Promise<void> {
		if (!await this.existsPath(src)) {
			throw new Error(`not exists ${src}`)
		}
		return new Promise<void>((resolve, reject) => {
			fs.copyFile(src, dest, err => err ? reject(err) : resolve())
		})
	}

	public async writeFile (filePath: string, content: string): Promise<void> {
		const dir = path.dirname(filePath)
		if (!await this.existsPath(dir)) {
			await this.mkdir(dir)
		}
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(filePath, content, { encoding: 'utf8' }, err => err ? reject(err) : resolve())
		})
	}

	public async mkdir (fullPath:string):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public async lstat (fullPath:string):Promise<fs.Stats> {
		return new Promise<fs.Stats>((resolve, reject) => {
			fs.lstat(fullPath, (err, stats) => err
				? reject(err)
				: resolve(stats))
		})
	}

	public getEnvironmentVariable (text:string):string|undefined {
		const startIndex = text.indexOf('${')
		if (startIndex < 0) {
			return undefined
		}
		const endIndex = text.indexOf('}', startIndex + 2)
		if (endIndex < 0) {
			throw new Error(`Environment variable not found end character "?" in ${text}`)
		}
		return text.substring(startIndex + 2, endIndex)
	}

	public solveEnvironmentVariables (source:any): void {
		if (typeof source !== 'object') {
			return
		}
		for (const name in source) {
			const child = source[name]
			if (typeof child === 'string' && child.indexOf('${') >= 0) {
				source[name] = this.replaceEnvironmentVariable(child)
			} else if (typeof child === 'object') {
				this.solveEnvironmentVariables(child)
			}
		}
	}

	private replaceEnvironmentVariable (text:any): any {
		// there can be more than one environment variable in text
		while (text.indexOf('${') >= 0) {
			const environmentVariable = this.getEnvironmentVariable(text)
			if (!environmentVariable) {
				continue
			}
			const environmentVariableValue = process.env[environmentVariable]
			if (environmentVariableValue === undefined || environmentVariableValue === null) {
				text = this.replace(text, '${' + environmentVariable + '}', '')
			} else {
				const objValue = this.tryParse(environmentVariableValue)
				const value = objValue ? JSON.stringify(objValue) : environmentVariableValue
				text = this.replace(text, '${' + environmentVariable + '}', value)
			}
		}
		return text
	}

	public tryParse (value:string):any|null {
		try {
			return JSON.parse(value)
		} catch {
			return null
		}
	}
}
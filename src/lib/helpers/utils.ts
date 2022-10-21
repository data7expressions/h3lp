import { Validator } from './validator'
import { exec } from 'child_process'
export class Utils {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly validator: Validator) { }

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

	public toNumber (value: any): number {
		return this.validator.isNull(value) ? 0 : parseFloat(value)
	}

	public nvl (value:any, _default:any):any {
		return !this.validator.isEmpty(value) ? value : _default
	}

	public nvl2 (value: any, a: any, b: any): any {
		return this.validator.isNotNull(value) ? a : b
	}

	public tryParse (value:string):any|null {
		try {
			return JSON.parse(value)
		} catch {
			return null
		}
	}

	public async sleep (ms = 1000): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms)
		})
	}

	public hashCode (text:string):number {
		let hash = 0
		if (text.length === 0) return hash
		for (let i = 0; i < text.length; i++) {
			const chr = text.charCodeAt(i)
			hash = ((hash << 5) - hash) + chr
			hash |= 0
		}
		return hash
	}

	public solveEnvironmentVars (source: any): any {
		return this.template(source, (match:string) => process.env[match], true)
	}

	public template (template: any, replacer:((match:string)=>string|undefined) | any, parse = false): string {
		const _replacer = typeof replacer === 'object' ? (p:string) => replacer[p] : replacer
		return this.anyTemplate(template, _replacer, parse)
	}

	private anyTemplate (source: any, replacer:(match:string)=>string|undefined, parse:boolean): any {
		if (Array.isArray(source)) {
			const result:any[] = []
			for (let i = 0; i < source.length; i++) {
				result.push(this.anyTemplate(source[i], replacer, parse))
			}
			return result
		} else if (typeof source === 'object') {
			const result:any = {}
			for (const entry of Object.entries(source)) {
				result[entry[0]] = this.anyTemplate(entry[1], replacer, parse)
			}
		} else if (typeof source === 'string') {
			const result = this.stringTemplate(source, replacer)
			if (parse) {
				const obj = this.tryParse(result)
				return obj !== undefined ? obj : result
			} else {
				return result
			}
		} else {
			return source
		}
	}

	private stringTemplate (template: string, replacer:(match:string)=>string|undefined): string {
		const buffer = Array.from(template)
		const length = buffer.length
		const result:string[] = []
		let chars = []
		let isEnvironmentVariable = false
		for (let index = 0; index < length; index++) {
			const current = buffer[index]
			if (isEnvironmentVariable) {
				if (current === '}') {
					const match = chars.join('')
					let value = replacer(match)
					if (value !== undefined) {
						value = this.stringTemplate(value, replacer)
						result.push(value)
					} else {
						result.push('${' + match + '}')
					}
					chars = []
					isEnvironmentVariable = false
				} else {
					chars.push(current)
				}
			} else if (index < length - 1 && current === '$' && buffer[index + 1] === '{') {
				isEnvironmentVariable = true
				index++
			} else {
				result.push(current)
			}
		}
		if (chars.length > 0) {
			result.push('${')
			result.push(...chars.join(''))
		}
		return result.join('')
	}
}

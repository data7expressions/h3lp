import { IReplacer } from '../domain'
import { exec } from 'child_process'
import { ContextReplacer, EnvironmentVariableReplacer, IUtils, IValidator, IObjectHelper } from '../application'

export class Utils implements IUtils {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly validator:IValidator, private obj:IObjectHelper) {}

	public getType (value: any): string {
		if (Array.isArray(value)) return 'array'
		if (typeof value === 'string') {
			// TODO determinar si es fecha.
			return 'string'
		}
		return typeof value
	}

	public escapeShell (cmd:string) {
		return cmd.replace(/(["'$`\\])/g, '\\$1')
	}

	public async exec (
		cmd: string,
		cwd: string = process.cwd()
	): Promise<any> {
		return new Promise<string>((resolve, reject) => {
			exec(this.escapeShell(cmd), { cwd }, (error: any, stdout: any, stderr: any) => {
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

	/**
	 * Random integer between 2 numbers
	 * @param min
	 * @param max
	 * @returns
	 */
	public randomInteger (min:number, max:number): number {
		return Math.floor(Math.random() * (max - min)) + min
	}

	public nvl (value: any, _default: any): any {
		return !this.validator.isEmpty(value) ? value : _default
	}

	public nvl2 (value: any, a: any, b: any): any {
		return this.validator.isNotNull(value) ? a : b
	}

	public tryParse (value: string): any | null {
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

	public hashCode (text: string): number {
		let hash = 0
		if (text.length === 0) return hash
		for (let i = 0; i < text.length; i++) {
			const chr = text.charCodeAt(i)
			hash = (hash << 5) - hash + chr
			hash |= 0
		}
		return hash
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	public isAsync (func:Function): boolean {
		// info: https://stackoverflow.com/questions/38508420/how-to-know-if-a-function-is-async
		const string = func.toString().trim()
		return !!(
			// native
			string.match(/^async /) ||
			string.match(/__awaiter/) ||
			// babel (this may change, but hey...)
			string.match(/return _ref[^\\.]*\.apply/)
			// insert your other dirty transpiler check
			// there are other more complex situations that maybe require you to check the return line for a *promise*
		)
	}

	public solveEnvironmentVars (source: any): any {
		return this.template(source, this.createEnvironmentVariableReplacer(), true)
	}

	public createEnvironmentVariableReplacer ():EnvironmentVariableReplacer {
		return new EnvironmentVariableReplacer()
	}

	public createContextReplacer ():ContextReplacer {
		return new ContextReplacer(this.obj)
	}

	public template (template: any, replacer: IReplacer | any, parse = false): string {
		if (this.implementReplacer(replacer)) {
			return this.anyTemplate(template, replacer, parse)
		} else if (typeof replacer === 'object') {
			return this.anyTemplate(template, this.createContextReplacer().context(replacer), parse)
		} else {
			throw new Error('replacer not supported')
		}
	}

	public implementReplacer (replacer: any): boolean {
		return typeof replacer === 'object' && replacer.replace !== undefined && typeof replacer.replace === 'function'
	}

	private anyTemplate (source: any, replacer: IReplacer, parse: boolean): any {
		if (source === undefined) {
			return undefined
		}
		if (source === null) {
			return null
		}
		if (Array.isArray(source)) {
			const result: any[] = []
			for (let i = 0; i < source.length; i++) {
				result.push(this.anyTemplate(source[i], replacer, parse))
			}
			return result
		} else if (typeof source === 'object') {
			const result: any = {}
			for (const entry of Object.entries(source)) {
				result[entry[0]] = this.anyTemplate(entry[1], replacer, parse)
			}
			return result
		} else if (typeof source === 'string') {
			const result = this.stringTemplate(source, replacer)
			if (parse && result.includes('{')) {
				const obj = this.tryParse(result)
				return obj !== null ? obj : result
			} else {
				return result
			}
		} else {
			return source
		}
	}

	private stringTemplate (template: string, replacer: IReplacer): string {
		const buffer = Array.from(template)
		const length = buffer.length
		const result: string[] = []
		let chars = []
		let isVar = false
		let close = ''
		for (let index = 0; index < length; index++) {
			const current = buffer[index]
			if (isVar) {
				if (current === close) {
					const match = chars.join('')
					const value = this.replace(match, close, replacer)
					result.push(value)
					if (close === ' ') {
						result.push(' ')
					}
					chars = []
					isVar = false
					close = ''
				} else {
					chars.push(current)
				}
			} else if (
				index < length - 1 &&
				current === '$' &&
				buffer[index + 1] === '{'
			) {
				// Example: ${XXX}
				isVar = true
				close = '}'
				index++
			} else if (
				index < length - 1 &&
				current === '$' &&
				buffer[index + 1] !== ' '
			) {
				// Example: $XXX
				isVar = true
				close = ' '
			} else {
				result.push(current)
			}
		}
		if (chars.length > 0) {
			if (close === '}') {
				// Example: 'words ${XXXX'
				result.push('${')
				result.push(...chars.join(''))
			} else {
				// Example: 'words $XXXX'
				const value = this.replace(chars.join(''), close, replacer)
				result.push(value)
			}
		}
		return result.join('')
	}

	private replace (match:string, close:string, replacer: IReplacer):string {
		const value = replacer.replace(match)
		if (value !== undefined && value !== null) {
			if (typeof value === 'string') {
				return this.stringTemplate(value, replacer)
			} else {
				return value
			}
		} else if (close === '}') {
			return '${' + match + '}'
		} else {
			return '$' + match
		}
	}
}

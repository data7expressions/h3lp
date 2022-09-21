import { Validator } from './validator'
import { exec } from 'child_process'
export class Helper {
	private validator: Validator
	constructor (validator: Validator) {
		this.validator = validator
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

	public toString (value: any): string {
		return this.validator.isNull(value) ? '' : value.toString()
	}

	public toNumber (value: any): number {
		return this.validator.isNull(value) ? 0 : parseFloat(value)
	}

	public concat (...values:any[]) :any {
		if (!values || values.length === 0) {
			return ''
		}
		if (typeof values[0] === 'string') {
			return ''.concat(...values)
		} else if (Array.isArray(values[0])) {
			return [].concat(...values)
		} else {
			const list:any[] = []
			for (const value of values) {
				list.push(value)
			}
			return list
		}
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
}

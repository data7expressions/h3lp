import { Validator } from './validator'
import { exec } from 'child_process'
export class Utils {
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
}

import { Utils } from './utils'

export class EnvHelper {
	private utils: Utils
	constructor (utils: Utils) {
		this.utils = utils
	}

	public solve (source: any, parse = false): any {
		if (Array.isArray(source)) {
			const result:any[] = []
			for (let i = 0; i < source.length; i++) {
				result.push(this.solve(source[i]))
			}
			return result
		} else if (typeof source === 'object') {
			const result:any = {}
			for (const entry of Object.entries(source)) {
				result[entry[0]] = this.solve(entry[1])
			}
		} else if (typeof source === 'string') {
			const result = this.solveString(source)
			if (parse) {
				const obj = this.utils.tryParse(result)
				return obj !== undefined ? obj : result
			} else {
				return result
			}
		} else {
			return source
		}
	}

	private solveString (source: string): string {
		const buffer = Array.from(source)
		const length = buffer.length
		const result:string[] = []
		let chars = []
		let isEnvironmentVariable = false
		for (let index = 0; index < length; index++) {
			const current = buffer[index]
			if (isEnvironmentVariable) {
				if (current === '}') {
					const environmentVariableName = chars.join('')
					let environmentVariableValue = process.env[environmentVariableName]
					if (environmentVariableValue !== undefined) {
						if (environmentVariableValue.indexOf('${') > -1) {
							environmentVariableValue = this.solveString(environmentVariableValue)
						}
						result.push(environmentVariableValue)
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

	// public get (text: string): string | undefined {
	// const startIndex = text.indexOf('${')
	// if (startIndex < 0) {
	// return undefined
	// }
	// const endIndex = text.indexOf('}', startIndex + 2)
	// if (endIndex < 0) {
	// throw new Error(`Environment variable not found end character "?" in ${text}`)
	// }
	// return text.substring(startIndex + 2, endIndex)
	// }

	// private replace (text: any): any {
	// // there can be more than one environment variable in text
	// while (text.indexOf('${') >= 0) {
	// const environmentVariable = this.get(text)
	// if (!environmentVariable) {
	// continue
	// }
	// const environmentVariableValue = process.env[environmentVariable]
	// if (environmentVariableValue === undefined || environmentVariableValue === null) {
	// text = this.string.replace(text, '${' + environmentVariable + '}', '')
	// } else {
	// const objValue = this.utils.tryParse(environmentVariableValue)
	// const value = objValue ? JSON.stringify(objValue) : environmentVariableValue
	// text = this.string.replace(text, '${' + environmentVariable + '}', value)
	// }
	// }
	// return text
	// }
}

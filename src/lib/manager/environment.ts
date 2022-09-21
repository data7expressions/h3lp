import { Helper } from './helper'

export class EnvironmentHelper {
	private helper: Helper
	constructor (helper: Helper) {
		this.helper = helper
	}

	public getEnvironmentVariable (text: string): string | undefined {
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

	public solveEnvironmentVariables (source: any): void {
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

	private replaceEnvironmentVariable (text: any): any {
		// there can be more than one environment variable in text
		while (text.indexOf('${') >= 0) {
			const environmentVariable = this.getEnvironmentVariable(text)
			if (!environmentVariable) {
				continue
			}
			const environmentVariableValue = process.env[environmentVariable]
			if (environmentVariableValue === undefined || environmentVariableValue === null) {
				text = this.helper.replace(text, '${' + environmentVariable + '}', '')
			} else {
				const objValue = this.helper.tryParse(environmentVariableValue)
				const value = objValue ? JSON.stringify(objValue) : environmentVariableValue
				text = this.helper.replace(text, '${' + environmentVariable + '}', value)
			}
		}
		return text
	}
}

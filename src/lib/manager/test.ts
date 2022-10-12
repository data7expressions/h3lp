import { TestSuiteRequest, TestSuite, TestCase, TestSuiteTemplate } from '../model/test'
import { StringHelper } from './string'

export class TestHelper {
	private string:StringHelper
	constructor (string: StringHelper) {
		this.string = string
	}

	public buildSuite (request: TestSuiteRequest): TestSuite {
		const suite: TestSuite = { name: request.name, context: request.context, cases: [] }
		for (const _caseRequest of request.cases) {
			const _case: TestCase = { name: _caseRequest.name, tests: [] }
			for (const test of _caseRequest.tests) {
				try {
					const result = _caseRequest.func(test, request.context)
					_case.tests.push({ test: test, result: result })
				} catch (error:any) {
					console.log(error.stack)
					console.log(`test: ${test} error: ${error}`)
				}
			}
			suite.cases.push(_case)
		}
		return suite
	}

	public build (suite: TestSuite, template: TestSuiteTemplate): string {
		const cases:string[] = []
		for (const _case of suite.cases) {
			const tests:string[] = []
			const caseTemplate = template.cases.find(p => p.name === _case.name)
			if (!caseTemplate) {
				console.error(`Test template for case ${_case.name} not found`)
				continue
			}
			for (const test of _case.tests) {
				let result
				if (Array.isArray(test.result)) {
					result = this.string.replace(JSON.stringify(test.result), '"', '\'')
				} else if (typeof test.result === 'object') {
					result = JSON.stringify(test.result)
				} else if (typeof test.result === 'string') {
					result = `'${test.result}'`
				} else {
					result = test.result
				}
				const testText = this.string.template(caseTemplate.template, { test: test.test, result: result })
				tests.push(testText)
			}
			// eslint-disable-next-line no-template-curly-in-string
			const caseText = this.string.template('\ttest(\'${name}\', () => {\n${tests}\t})\n', { name: _case.name, tests: tests.join('') })
			cases.push(caseText)
		}
		return this.string.template(template.template, { name: suite.name, context: suite.context !== undefined ? JSON.stringify(suite.context) : '{}', cases: cases.join('') })
	}
}

import {
	TestSuiteRequest,
	TestSuite,
	TestCase,
	TestSuiteTemplate,
	IBuildTest
} from '../contract/test'
import { Utils } from './utils'
import { FsHelper } from './fs'
import { ObjectHelper } from './object'
import { StringHelper } from './string'

export class TestSuiteBuilder {
	private tests: IBuildTest[] = []

	// eslint-disable-next-line no-useless-constructor
	constructor (
		private readonly fs: FsHelper,
		private readonly obj: ObjectHelper
	) {}

	public add (test: IBuildTest): TestSuiteBuilder {
		this.tests.push(test)
		return this
	}

	public async build (path: string): Promise<void> {
		for (const test of this.tests) {
			const suite = this.buildSuite(test.build())
			await this.fs.write(
				`${path}/${suite.name}.json`,
				JSON.stringify(suite, null, 2)
			)
		}
	}

	private buildSuite (request: TestSuiteRequest): TestSuite {
		const suite: TestSuite = {
			name: request.name,
			context: this.obj.clone(request.context),
			cases: []
		}
		for (const _caseRequest of request.cases) {
			const _case: TestCase = { name: _caseRequest.name, tests: [] }
			for (const test of _caseRequest.tests) {
				try {
					const result = _caseRequest.func(test, request.context)
					_case.tests.push({ test: test, result: result })
				} catch (error: any) {
					console.log(error.stack)
					console.log(`test: ${test} error: ${error}`)
				}
			}
			suite.cases.push(_case)
		}
		return suite
	}
}

export class TestHelper {
	// eslint-disable-next-line no-useless-constructor
	constructor (
		private readonly string: StringHelper,
		private readonly obj: ObjectHelper,
		private readonly utils: Utils,
		private readonly fs: FsHelper
	) {}

	public build (suite: TestSuite, template: TestSuiteTemplate): string {
		const cases: string[] = []
		for (const _case of suite.cases) {
			const tests: string[] = []
			const caseTemplate = template.cases.find((p) => p.name === _case.name)
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
				const testText = this.utils.template(caseTemplate.template, {
					result: result,
					// eslint-disable-next-line quotes
					test: test.test.includes('\n')
						? '`' + test.test + '`'
						: '\'' + test.test + '\''
				})
				tests.push(testText)
			}
			const caseText = this.utils.template(
				// eslint-disable-next-line no-template-curly-in-string
				'\ttest(\'${name}\', () => {\n${tests}\t})\n',
				{ name: _case.name, tests: tests.join('') }
			)
			cases.push(caseText)
		}
		const data = {
			name: suite.name,
			context:
				suite.context !== undefined ? JSON.stringify(suite.context) : '{}',
			cases: cases.join('')
		}
		return this.utils.template(template.template, data)
	}

	public createSuiteBuilder (): TestSuiteBuilder {
		return new TestSuiteBuilder(this.fs, this.obj)
	}
}

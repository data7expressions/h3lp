import {
	IBuildTest, TestBuildInfo, TestSuiteRequest,
	TestSuite, TestCase, TestSuiteTemplate
} from '../domain'
import { ITestHelper, IStringHelper, IObjectHelper, IFsHelper, IUtils, ITestSuiteBuilder, ITestBuilder } from '../application'

export class TestSuiteBuilder implements ITestSuiteBuilder {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly utils:IUtils, private readonly fs:IFsHelper, private readonly obj:IObjectHelper) {}

	private tests: IBuildTest[] = []

	public add (test: IBuildTest): ITestSuiteBuilder {
		this.tests.push(test)
		return this
	}

	public async build (path: string): Promise<void> {
		for (const test of this.tests) {
			const suite = await this.buildSuite(test.build())
			await this.fs.write(
				`${path}/${suite.name}.json`,
				JSON.stringify(suite, null, 2)
			)
		}
	}

	private async buildSuite (request: TestSuiteRequest): Promise<TestSuite> {
		const suite: TestSuite = {
			name: request.name,
			context: this.obj.clone(request.context),
			cases: [],
			errors: 0
		}
		for (const _caseRequest of request.cases) {
			const _case: TestCase = { name: _caseRequest.name, tests: [], errors: 0 }
			let errors = 0
			for (const test of _caseRequest.tests) {
				try {
					if (this.utils.isAsync(_caseRequest.func)) {
						const result = await _caseRequest.func(test, request.context)
						_case.tests.push({ test, result })
					} else {
						const result = _caseRequest.func(test, request.context)
						_case.tests.push({ test, result })
					}
				} catch (error: any) {
					errors++
					_case.tests.push({ test, error: error.toString(), stack: error.stack.toString() })
				}
			}
			_case.errors = errors
			suite.cases.push(_case)
		}
		suite.errors = suite.cases.reduce((errors, p) => p.errors + errors, 0)
		if (suite.errors > 0) {
			console.error(`${suite.name} ${suite.errors} errors`)
		}
		return suite
	}
}

export class TestBuilder implements ITestBuilder {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly utils:IUtils, private readonly fs:IFsHelper, private readonly str:IStringHelper) {}
	private tests: TestBuildInfo[] = []

	public add (info: TestBuildInfo): TestBuilder {
		this.tests.push(info)
		return this
	}

	public async build (path: string): Promise<void> {
		for (const test of this.tests) {
			if (test.suite === undefined && test.source !== undefined) {
				const content = await this.fs.read(test.source)
				if (content === undefined || content === null) {
					throw new Error(`${test.source} not found`)
				}
				test.suite = JSON.parse(content)
			}
			if (test.suite === undefined) {
				throw new Error('Test suite undefined')
			}
			const content = this.buildSuite(test.suite, test.template)
			await this.fs.write(`${path}/${test.suite.name}.test.ts`, content)
		}
	}

	private buildSuite (suite: TestSuite, template: TestSuiteTemplate): string {
		const cases: string[] = []
		for (const _case of suite.cases) {
			const tests: string[] = []
			const caseTemplate = template.cases.find((p) => p.name === _case.name)
			if (!caseTemplate) {
				console.warn(`Test template for case ${_case.name} not found`)
				continue
			}
			for (const test of _case.tests) {
				let result
				if (Array.isArray(test.result)) {
					result = this.str.replace(JSON.stringify(test.result), '"', '\'')
				} else if (typeof test.result === 'object') {
					result = JSON.stringify(test.result)
				} else if (typeof test.result === 'string') {
					result = `'${test.result}'`
				} else {
					result = test.result
				}
				const testText = this.utils.template(caseTemplate.template, {
					result,
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
		const suiteText = this.utils.template(
			// eslint-disable-next-line no-template-curly-in-string
			'describe(\'${name}\', () => {\n\tconst context = JSON.parse(\'${context}\')\n${cases}})\n',
			{
				name: suite.name,
				context:
				suite.context !== undefined ? JSON.stringify(suite.context) : '{}',
				cases: cases.join('')
			}
		)
		return `${template.header}\n${suiteText}`
	}
}

export class TestHelper implements ITestHelper {
	// eslint-disable-next-line no-useless-constructor
	constructor (
		private readonly utils:IUtils,
		private readonly fs:IFsHelper,
		private readonly str:IStringHelper,
		private readonly obj:IObjectHelper
	) {}

	public createBuilder (): TestBuilder {
		return new TestBuilder(this.utils, this.fs, this.str)
	}

	public createSuiteBuilder (): TestSuiteBuilder {
		return new TestSuiteBuilder(this.utils, this.fs, this.obj)
	}
}

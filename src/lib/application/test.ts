import { IBuildTest, TestBuildInfo } from '../domain'

export interface ITestSuiteBuilder {
	add (test: IBuildTest): ITestSuiteBuilder
	build (path: string): Promise<void>
}

export interface ITestBuilder {
	add (info: TestBuildInfo): ITestBuilder
	build (path: string): Promise<void>
}

export interface ITestHelper {
	createBuilder (): ITestBuilder
	createSuiteBuilder (): ITestSuiteBuilder
}

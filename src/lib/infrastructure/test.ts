import { Service } from '../domain'
import { TestBuilder, TestSuiteBuilder, ITestHelper, IStringHelper, IObjectHelper, IFsHelper, IUtils } from '../application'

@Service('helper.helper')
export class TestHelper implements ITestHelper {
	// eslint-disable-next-line no-useless-constructor
	constructor (
		private readonly string: IStringHelper,
		private readonly obj: IObjectHelper,
		private readonly utils: IUtils,
		private readonly fs: IFsHelper
	) {}

	public createBuilder (): TestBuilder {
		return new TestBuilder(this.string, this.utils, this.fs)
	}

	public createSuiteBuilder (): TestSuiteBuilder {
		return new TestSuiteBuilder(this.fs, this.obj, this.utils)
	}
}

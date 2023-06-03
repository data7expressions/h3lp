import { IUtils, IValidator, IFsHelper, IHttpHelper, IObjectHelper, IStringHelper, ITestHelper, IArrayHelper } from '.'
export class H3lp {
	// eslint-disable-next-line no-useless-constructor
	constructor (public readonly utils: IUtils,
	public readonly val:IValidator,
	public readonly fs:IFsHelper,
	public readonly http:IHttpHelper,
	public readonly obj:IObjectHelper,
	public readonly str:IStringHelper,
	public readonly test:ITestHelper,
	public readonly array:IArrayHelper) {}
}

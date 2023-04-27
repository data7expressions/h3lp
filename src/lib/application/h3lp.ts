import { IUtils, IValidator, IFsHelper, IHttpHelper, IObjectHelper, IStringHelper, ITestHelper, IArrayHelper } from '.'
import { Autowired } from '../domain'
export class H3lp {
	@Autowired('helper.utils')
	public utils!: IUtils

	@Autowired('helper.val')
	public val!:IValidator

	@Autowired('helper.fs')
	public fs!:IFsHelper

	@Autowired('helper.http')
	public http!:IHttpHelper

	@Autowired('helper.obj')
	public obj!:IObjectHelper

	@Autowired('helper.str')
	public str!:IStringHelper

	@Autowired('helper.test')
	public test!:ITestHelper

	@Autowired('helper.array')
	public array!:IArrayHelper
}

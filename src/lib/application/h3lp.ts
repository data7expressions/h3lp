import { IUtils, IValidator, IFsHelper, IHttpHelper, IObjectHelper, IStringHelper, ITestHelper, IArrayHelper } from '.'
import { Autowired } from '../domain'
export class H3lp {
	@Autowired('h3lp.utils')
	public utils!: IUtils

	@Autowired('h3lp.val')
	public val!:IValidator

	@Autowired('h3lp.fs')
	public fs!:IFsHelper

	@Autowired('h3lp.http')
	public http!:IHttpHelper

	@Autowired('h3lp.obj')
	public obj!:IObjectHelper

	@Autowired('h3lp.string')
	public str!:IStringHelper

	@Autowired('h3lp.test')
	public test!:ITestHelper

	@Autowired('h3lp.array')
	public array!:IArrayHelper
}

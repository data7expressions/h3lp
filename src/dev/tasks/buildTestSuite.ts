import { h3lp } from '../../lib'
import { ObjectBuildTest, StringBuildTest, UtilsBuildTest } from '../builders'
export async function apply (callback: any) {
	await h3lp.test
		.createSuiteBuilder()
		.add(new ObjectBuildTest())
		.add(new StringBuildTest())
		.add(new UtilsBuildTest())
		.build('./src/dev/testSuite')
	callback()
}
apply(function () { console.log('end') })

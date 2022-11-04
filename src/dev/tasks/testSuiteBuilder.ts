import { h3lp } from '../../lib'
import { ObjectBuildTest, StringBuildTest, UtilsBuildTest } from '../builders'
;(async () => {
	await h3lp.test
		.createSuiteBuilder()
		.add(new ObjectBuildTest())
		.add(new StringBuildTest())
		.add(new UtilsBuildTest())
		.build('./testSuite')
})()

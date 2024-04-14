/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../lib'
;(async () => {
	console.log(h3lp.str.notation('BI_CODE', 'camel'))
	console.log(h3lp.str.notation('BusinessCode', 'camel'))
	console.log(h3lp.str.notation('business_code', 'camel'))
	console.log(h3lp.str.notation('BUSINESSCODE', 'camel'))
	console.log(h3lp.str.notation('BUSINESS_CODE', 'camel'))
	console.log(h3lp.str.notation('fl@vio', 'camel'))
	console.log(h3lp.str.notation('convert2string', 'camel'))
	console.log(h3lp.str.notation('CONVERT2STRING', 'camel'))
})()

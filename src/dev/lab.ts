/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../lib'
;(async () => {
	const context = {
		firstName: 'Pedro',
		lastName: 'Brieger',
		portal: 'www.nodal.am'
	}
	let result = h3lp.utils.template('Display: ${DISPLAY} shell: ${SHELL}', h3lp.utils.createEnvironmentVariableReplacer())
	console.log(result)
	result = h3lp.utils.template('Display: $DISPLAY shell: $SHELL', h3lp.utils.createEnvironmentVariableReplacer())
	console.log(result)
})()

/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../lib'
;(async () => {
	// let result = h3lp.utils.template('Display: ${DISPLAY} shell: ${SHELL}', h3lp.utils.createEnvironmentVariableReplacer())
	// console.log(result)
	// result = h3lp.utils.template('Display: $DISPLAY shell: $SHELL', h3lp.utils.createEnvironmentVariableReplacer())
	// console.log(result)
	// console.log(h3lp.str.capitalize('hello world'))
	console.log(h3lp.str.notation('_Hello world', 'camel'))
})()

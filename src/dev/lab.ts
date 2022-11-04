import { h3lp } from '../lib'
;(async () => {
	const context = {
		firstName: 'Pedro',
		lastName: 'Brieger',
		portal: 'www.nodal.am'
	}
	// eslint-disable-next-line no-template-curly-in-string
	const result = h3lp.utils.template('no existe ${noExiste}', context)
	console.log(result)
})()

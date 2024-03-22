/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../lib'
;(async () => {
	const a = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Branco ', gmt: -5 }] }] }
	const b = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Branco ', gmt: -6 }] }] }

	const delta = h3lp.obj.delta(a, b)
	const workspace = __dirname.replace('build/', 'src/')
	console.log(JSON.stringify(delta))
	await h3lp.fs.write(workspace + '/delta.json', JSON.stringify(delta, null, 2))
})()

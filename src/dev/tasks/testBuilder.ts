/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../../lib'
import path from 'path'

const objectTemplate = {
	header:
`/* eslint-disable object-curly-spacing */
/* eslint-disable comma-spacing */
/* eslint-disable key-spacing */
/* eslint-disable quote-props */
import { h3lp } from '../../lib'
`,
	cases: [{
		name: 'access',
		template: '\t\texpect(h3lp.obj.getValue(context,${test})).toStrictEqual(${result})\n'
	}]
}

const stringTemplate = {
	header:
`/* eslint-disable @typescript-eslint/no-unused-vars */
import { h3lp } from '../../lib'
`,
	cases: [{
		name: 'capitalize',
		template: '\t\texpect(h3lp.string.capitalize(${test})).toStrictEqual(${result})\n'
	},
	{
		name: 'initCap',
		template: '\t\texpect(h3lp.string.initCap(${test})).toStrictEqual(${result})\n'
	},
	{
		name: 'normalize',
		template: '\t\texpect(h3lp.string.normalize(${test})).toStrictEqual(${result})\n'
	}]
}

const utilsTemplate = {
	header:
`/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../../lib'
`,
	cases: [{
		name: 'template',
		template: '\t\texpect(h3lp.utils.template(${test}, context)).toStrictEqual(${result})\n'
	}]
}

;(async () => {
	const root = './src/dev/testSuite'
	await h3lp.test
		.createBuilder()
		.add({ source: path.join(root, 'object.json'), template: objectTemplate })
		.add({ source: path.join(root, 'string.json'), template: stringTemplate })
		.add({ source: path.join(root, 'utils.json'), template: utilsTemplate })
		.build('./src/tests/__tests__')
})()

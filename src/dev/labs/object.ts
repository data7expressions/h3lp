/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../../lib'

(async () => {
	const test = {
		name: 'object',
		context: {
			orders: [
				{
					number: '20001',
					customer: { firstName: 'John', lastName: 'Murphy' },
					orderTime: '2022-07-30T10:15:54',
					details: [
						{ article: 'Pear', unitPrice: 1.78, qty: 2 },
						{ article: 'Banana', unitPrice: 1.99, qty: 1 },
						{ article: 'White grape', unitPrice: 2.03, qty: 1 }
					]
				},
				{
					number: '20002',
					customer: { firstName: 'Paul', lastName: 'Smith' },
					orderTime: '2022-07-30T12:12:43',
					details: [
						{ article: 'Apple', unitPrice: 2.15, qty: 1 },
						{ article: 'Banana', unitPrice: 1.99, qty: 2 },
						{ article: 'Pear', unitPrice: 1.78, qty: 1 }
					]
				}
			]
		},
		cases: [{
			name: 'access',
			func: (item: any, context: any) => h3lp.obj.getValue(context, item),
			tests: [
				'orders.number',
				'orders.0.number',
				'orders.1.customer.firstName',
				'orders.customer.firstName',
				'orders.0.details.article',
				'orders.0.details'
			]
		}
		]
	}
	const suite = h3lp.test.buildSuite(test)
	await h3lp.fs.write(`./src/dev/tests/${suite.name}.json`, JSON.stringify(suite, null, 2))
	const template = {
		template: '/* eslint-disable object-curly-spacing */\n/* eslint-disable comma-spacing */\n/* eslint-disable key-spacing */\n/* eslint-disable quote-props */import { h3lp } from \'../../lib\'\ndescribe(\'${name}\', () => {\n\tconst context = JSON.parse(\'${context}\')\n${cases}})\n',
		cases: [{
			name: 'access',
			template: '\t\texpect(h3lp.obj.getValue(context,\'${test}\')).toStrictEqual(${result})\n'
		}]
	}
	const content = h3lp.test.build(suite, template)
	await h3lp.fs.write(`./src/tests/__tests__/${suite.name}.test.ts`, content)
})()

/* eslint-disable no-template-curly-in-string */
import { h3lp, IBuildTest, TestSuiteRequest } from '../../lib'

export class UtilsBuildTest implements IBuildTest {
	public build (): TestSuiteRequest {
		return {
			name: 'utils',
			context: {
				firstName: 'Pedro',
				lastName: 'Brieger',
				portal: 'www.nodal.am',
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
				name: 'template',
				func: (item: any, context: any) => h3lp.utils.template(item, context),
				tests: [
					'${firstName} ${lastName} es el autor del portal ${portal}',
					'order number ${orders.0.number}',
					'no existe ${noExiste}'
				]
			}
			// {
			// name: 'templateEnv',
			// func: (item: any) => h3lp.utils.template(item, h3lp.utils.createEnvironmentVariableReplacer()),
			// tests: [
			// 'Display: ${DISPLAY}  shell: ${SHELL}',
			// 'Display: $DISPLAY shell: $SHELL'
			// ]
			// }
			]
		}
	}
}

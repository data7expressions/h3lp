/* eslint-disable no-template-curly-in-string */
import { h3lp, IBuildTest, TestSuiteRequest } from '../../lib'

export class ObjectBuildTest implements IBuildTest {
	public build (): TestSuiteRequest {
		return {
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
			cases: [
				{
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
	}
}

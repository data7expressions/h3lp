/* eslint-disable object-curly-spacing */
/* eslint-disable comma-spacing */
/* eslint-disable key-spacing */
/* eslint-disable quote-props */import { h3lp } from '../../lib'
describe('object', () => {
	const context = JSON.parse('{"orders":[{"number":"20001","customer":{"firstName":"John","lastName":"Murphy"},"orderTime":"2022-07-30T10:15:54","details":[{"article":"Pear","unitPrice":1.78,"qty":2},{"article":"Banana","unitPrice":1.99,"qty":1},{"article":"White grape","unitPrice":2.03,"qty":1}]},{"number":"20002","customer":{"firstName":"Paul","lastName":"Smith"},"orderTime":"2022-07-30T12:12:43","details":[{"article":"Apple","unitPrice":2.15,"qty":1},{"article":"Banana","unitPrice":1.99,"qty":2},{"article":"Pear","unitPrice":1.78,"qty":1}]}]}')
	test('access', () => {
		expect(h3lp.obj.getValue('orders.number', context)).toStrictEqual(['20001','20002'])
		expect(h3lp.obj.getValue('orders.0.number', context)).toStrictEqual('20001')
		expect(h3lp.obj.getValue('orders.1.customer.firstName', context)).toStrictEqual('Paul')
		expect(h3lp.obj.getValue('orders.customer.firstName', context)).toStrictEqual(['John','Paul'])
		expect(h3lp.obj.getValue('orders.0.details.article', context)).toStrictEqual(['Pear','Banana','White grape'])
		expect(h3lp.obj.getValue('orders.0.details', context)).toStrictEqual([{'article':'Pear','unitPrice':1.78,'qty':2},{'article':'Banana','unitPrice':1.99,'qty':1},{'article':'White grape','unitPrice':2.03,'qty':1}])
	})
})

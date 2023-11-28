/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../../'

describe('utils', () => {
	const context = JSON.parse('{"firstName":"Pedro","lastName":"Brieger","portal":"www.nodal.am","orders":[{"number":"20001","customer":{"firstName":"John","lastName":"Murphy"},"orderTime":"2022-07-30T10:15:54","details":[{"article":"Pear","unitPrice":1.78,"qty":2},{"article":"Banana","unitPrice":1.99,"qty":1},{"article":"White grape","unitPrice":2.03,"qty":1}]},{"number":"20002","customer":{"firstName":"Paul","lastName":"Smith"},"orderTime":"2022-07-30T12:12:43","details":[{"article":"Apple","unitPrice":2.15,"qty":1},{"article":"Banana","unitPrice":1.99,"qty":2},{"article":"Pear","unitPrice":1.78,"qty":1}]}]}')
	test('template', () => {
		expect(h3lp.utils.template('${firstName} ${lastName} es el autor del portal ${portal}', context)).toStrictEqual('Pedro Brieger es el autor del portal www.nodal.am')
		expect(h3lp.utils.template('order number ${orders.0.number}', context)).toStrictEqual('order number 20001')
		expect(h3lp.utils.template('no existe ${noExiste}', context)).toStrictEqual('no existe ${noExiste}')
	})
})

/* eslint-disable object-curly-spacing */
/* eslint-disable comma-spacing */
/* eslint-disable key-spacing */
/* eslint-disable quote-props */
import { h3lp } from '../../'

describe('object', () => {
	const context = JSON.parse('{"orders":[{"number":"20001","customer":{"firstName":"John","lastName":"Murphy"},"orderTime":"2022-07-30T10:15:54","details":[{"article":"Pear","unitPrice":1.78,"qty":2},{"article":"Banana","unitPrice":1.99,"qty":1},{"article":"White grape","unitPrice":2.03,"qty":1}]},{"number":"20002","customer":{"firstName":"Paul","lastName":"Smith"},"orderTime":"2022-07-30T12:12:43","details":[{"article":"Apple","unitPrice":2.15,"qty":1},{"article":"Banana","unitPrice":1.99,"qty":2},{"article":"Pear","unitPrice":1.78,"qty":1}]}]}')
	test('access', () => {
		expect(h3lp.obj.getValue(context,'orders.number')).toStrictEqual(['20001','20002'])
		expect(h3lp.obj.getValue(context,'orders.0.number')).toStrictEqual('20001')
		expect(h3lp.obj.getValue(context,'orders.1.customer.firstName')).toStrictEqual('Paul')
		expect(h3lp.obj.getValue(context,'orders.customer.firstName')).toStrictEqual(['John','Paul'])
		expect(h3lp.obj.getValue(context,'orders.0.details.article')).toStrictEqual(['Pear','Banana','White grape'])
		expect(h3lp.obj.getValue(context,'orders.0.details')).toStrictEqual([{'article':'Pear','unitPrice':1.78,'qty':2},{'article':'Banana','unitPrice':1.99,'qty':1},{'article':'White grape','unitPrice':2.03,'qty':1}])
	})
	test('delta simple object', () => {
		const a = { a: 1, b: 'test' }
		const b = { a: 1, b: 'Test' }
		const expected = '{"unchanged":[{"name":"a","value":1}],"changed":[{"name":"b","new":"test","old":"Test"}]}'
		const delta = h3lp.obj.delta(a, b)
		expect(JSON.stringify(delta)).toStrictEqual(expected)
	})
	test('delta property array of numbers', () => {
		const a = { a: 1, b: [1, 2, 3] }
		const b = { a: 1, b: [1, 2, 4] }
		const expected = '{"unchanged":[{"name":"a","value":1}],"children":[{"name":"b","type":"array","change":true,"delta":{"new":[{"name":"2","new":3}],"remove":[{"name":"2","old":4}],"unchanged":[{"name":"0","value":1},{"name":"1","value":2}]}}]}'
		const delta = h3lp.obj.delta(a, b)
		expect(JSON.stringify(delta)).toStrictEqual(expected)
	})
	test('delta object property', () => {
		const a = { a: 1, b: { code: 'ARG', name: 'Argentina' } }
		const b = { a: 1, b: { code: 'ARG', name: 'argentina' } }
		const expected = '{"unchanged":[{"name":"a","value":1}],"changed":[{"name":"b","new":{"code":"ARG","name":"Argentina"},"old":{"code":"ARG","name":"argentina"},"delta":{"unchanged":[{"name":"code","value":"ARG"}],"changed":[{"name":"name","new":"Argentina","old":"argentina"}]}}]}'
		const delta = h3lp.obj.delta(a, b)
		expect(JSON.stringify(delta)).toStrictEqual(expected)
	})
	test('delta property array of objects', () => {
		const a = { a: 1, b: [{ code: 'ARG', name: 'Argentina' }, { code: 'BR', name: 'Brasil' }] }
		const b = { a: 1, b: [{ code: 'ARG', name: 'Argentina' }, { code: 'BR', name: 'Brazil' }] }
		const expected = '{"unchanged":[{"name":"a","value":1}],"children":[{"name":"b","type":"array","change":true,"delta":{"unchanged":[{"name":"b","value":{"code":"ARG","name":"Argentina"}}],"changed":[{"name":"b","new":{"code":"BR","name":"Brasil"},"old":{"code":"BR","name":"Brazil"},"delta":{"unchanged":[{"name":"code","value":"BR"}],"changed":[{"name":"name","new":"Brasil","old":"Brazil"}]}}]}}]}'
		const delta = h3lp.obj.delta(a, b)
		expect(JSON.stringify(delta)).toStrictEqual(expected)
	})
	test('delta complex', () => {
		const a = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Branco ', gmt: -5 }] }] }
	  const b = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Blanco ', gmt: -5 }] }] }
		const expected = '{"unchanged":[{"name":"a","value":1}],"children":[{"name":"b","type":"array","change":true,"delta":{"changed":[{"name":"b","new":{"code":"BR","name":"Brasil","zones":[{"code":"Belén","gmt":-3},{"code":"Manaos","gmt":-4},{"code":"Rio Branco ","gmt":-5}]},"old":{"code":"BR","name":"Brasil","zones":[{"code":"Belén","gmt":-3},{"code":"Manaos","gmt":-4},{"code":"Rio Blanco ","gmt":-5}]},"delta":{"unchanged":[{"name":"code","value":"BR"},{"name":"name","value":"Brasil"}],"children":[{"name":"zones","type":"array","change":true,"delta":{"unchanged":[{"name":"zones","value":{"code":"Belén","gmt":-3}},{"name":"zones","value":{"code":"Manaos","gmt":-4}}],"new":[{"name":"zones","new":{"code":"Rio Branco ","gmt":-5}}],"remove":[{"name":"zones","old":{"code":"Rio Blanco ","gmt":-5}}]}}]}}]}}]}'
		const delta = h3lp.obj.delta(a, b)
		expect(JSON.stringify(delta)).toStrictEqual(expected)
	})
	test('delta complex II', () => {
		const a = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Branco ', gmt: -5 }] }] }
	  const b = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Branco ', gmt: -6 }] }] }
		const expected = '{"unchanged":[{"name":"a","value":1}],"children":[{"name":"b","type":"array","change":true,"delta":{"changed":[{"name":"b","new":{"code":"BR","name":"Brasil","zones":[{"code":"Belén","gmt":-3},{"code":"Manaos","gmt":-4},{"code":"Rio Branco ","gmt":-5}]},"old":{"code":"BR","name":"Brasil","zones":[{"code":"Belén","gmt":-3},{"code":"Manaos","gmt":-4},{"code":"Rio Branco ","gmt":-6}]},"delta":{"unchanged":[{"name":"code","value":"BR"},{"name":"name","value":"Brasil"}],"children":[{"name":"zones","type":"array","change":true,"delta":{"unchanged":[{"name":"zones","value":{"code":"Belén","gmt":-3}},{"name":"zones","value":{"code":"Manaos","gmt":-4}}],"changed":[{"name":"zones","new":{"code":"Rio Branco ","gmt":-5},"old":{"code":"Rio Branco ","gmt":-6},"delta":{"unchanged":[{"name":"code","value":"Rio Branco "}],"changed":[{"name":"gmt","new":-5,"old":-6}]}}]}}]}}]}}]}'
		const delta = h3lp.obj.delta(a, b)
		expect(JSON.stringify(delta)).toStrictEqual(expected)
	})
	test('delta ignore option', () => {
		const a = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Branco ', gmt: -5 }] }] }
	  const b = { a: 1, b: [{ code: 'BR', name: 'Brasil', zones: [{ code: 'Belén', gmt: -3 }, { code: 'Manaos', gmt: -4 }, { code: 'Rio Branco ', gmt: -6 }] }] }
		const expected = '{"unchanged":[{"name":"a","value":1}],"children":[{"name":"b","type":"array","change":false,"delta":{"unchanged":[{"name":"b","value":{"code":"BR","name":"Brasil","zones":[{"code":"Belén","gmt":-3},{"code":"Manaos","gmt":-4},{"code":"Rio Branco ","gmt":-6}]}}]}}]}'
		const delta = h3lp.obj.delta(a, b,{ ignore: ['b.zones.gmt'] })
		expect(JSON.stringify(delta)).toStrictEqual(expected)
	})
})

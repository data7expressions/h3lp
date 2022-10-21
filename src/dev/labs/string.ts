/* eslint-disable no-template-curly-in-string */
import { h3lp } from '../../lib'

(async () => {
	const test = {
		name: 'string',
		context: {
			firstName: 'Pedro',
			lastName: 'Brieger',
			portal: 'www.nodal.am'
		},
		cases: [{
			name: 'template',
			func: (item: any, context:any) => h3lp.utils.template(item, context),
			tests: [
				'${firstName} ${lastName} es el autor del portal ${portal}',
				'no existe ${noExiste}'
			]
		},
		{
			name: 'capitalize',
			func: (item: any) => h3lp.string.capitalize(item),
			tests: [
				'hello world',
				'house'
			]
		},
		{
			name: 'initCap',
			func: (item: any) => h3lp.string.initCap(item),
			tests: [
				'Lo peor que hacen los malos es obligarnos a dudar de los buenos',
				'El dinero no puede comprar la vida',
				'Los hermanos sean unidos porque ésa es la ley primera'
			]
		},
		{
			name: 'normalize',
			func: (item: any) => h3lp.string.normalize(item),
			tests: [
				'abcdefghijklmnopqrstuvwxyz',
				'0123456789',
				'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				'Ø ø',
				'À Á Â Ã Ä Å à á â ã ä å Ā ā Ă ă Ą ą Ƌ ƌ Ǎ ǎ Ȁ ȁ Ȃ ȃ Ȧ ȧ',
				'ƀ Ɓ Ƃ ƃ',
				'Ç ç Ć ć Ĉ ĉ Ċ ċ Č č Ɔ Ƈ ƈ',
				'Ď ď Đ đ  Ɖ Ɗ ȡ',
				'È É Ê Ëè é ê ë Ē ē Ĕ ĕ Ė ė Ę ę Ě ě  Œ œ Ǝ Ɛ ǝ Ȅ ȅ Ȇ ȇ Ȩ ȩ',
				'Ƒ ƒ',
				'Ì Í Î Ïì í î ï',
				'Ĝ ĝ Ğ ğ Ġ ġ Ģ ģ Ɠ Ǥ ǥ Ǧ ǧ Ǵ ǵ',
				'Ĥ ĥ Ħ ħ Ȟ ȟ',
				'Ĩ ĩ Ī ī Ĭ ĭ Į į İ Ɨ Ǐ ǐ Ȉ ȉ Ȋ ȋ',
				'Ĵ ĵ',
				'Ƙ ƙ Ǩ ǩ',
				'Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł ƚ',
				'Ñ ñ Ń ń Ņ ņ Ň ň Ɲ ƞ  Ǹ ǹ Ƞ',
				'Ò Ó Ô Õ Ö ò ó ô õ ö Ō ō Ŏ ŏ Ő ő Ɵ Ơ ơ Ǒ ǒ Ȍ ȍ Ȏ ȏ Ȯ ȯ',
				'Ƥ ƥ',
				'Ǫ ǫ',
				'Ŕ ŕ Ŗ ŗ Ř ř Ʀ Ȑ ȑ Ȓ ȓ',
				'Ś ś Ŝ ŝ Ş ş Š š Ș ș',
				'Ţ ţ Ť ť Ŧ ŧ ƫ Ƭ ƭ Ʈ Ț ț',
				'Ù Ú Û Ü ù ú û ü Ũ ũ Ū ū Ŭ ŭ Ů ů Ű ű Ư ư Ʋ Ǔ ǔ Ȕ ȕ Ȗ ȗ',
				'Ý ý ÿ Ų ų',
				'Ŵ ŵ',
				' Ŷ ŷ Ÿ Ȳ ȳ',
				'Ɯ',
				'Ƴ ƴ',
				'Ź ź Ż ż Ž ž Ƶ ƶ Ȥ ȥ'
			]
		}
		]
	}
	const suite = h3lp.test.buildSuite(test)
	await h3lp.fs.write(`./src/dev/tests/${suite.name}.json`, JSON.stringify(suite, null, 2))

	const template = {
		template: '/* eslint-disable no-template-curly-in-string */\nimport { h3lp } from \'../../lib\'\ndescribe(\'${name}\', () => {\n\tconst context = JSON.parse(\'${context}\')\n${cases}})\n',
		cases: [{
			name: 'template',
			template: '\t\texpect(h3lp.utils.template(\'${test}\', context)).toStrictEqual(${result})\n'
		},
		{
			name: 'capitalize',
			template: '\t\texpect(h3lp.string.capitalize(\'${test}\')).toStrictEqual(${result})\n'
		},
		{
			name: 'initCap',
			template: '\t\texpect(h3lp.string.initCap(\'${test}\')).toStrictEqual(${result})\n'
		},
		{
			name: 'normalize',
			template: '\t\texpect(h3lp.string.normalize(\'${test}\')).toStrictEqual(${result})\n'
		}]
	}
	const content = h3lp.test.build(suite, template)
	await h3lp.fs.write(`./src/tests/__tests__/${suite.name}.test.ts`, content)
})()

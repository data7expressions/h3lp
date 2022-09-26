import { Validator } from './validator'

export class StringHelper {
	private validator: Validator
	constructor (validator: Validator) {
		this.validator = validator
	}

	public toString (value: any): string {
		return this.validator.isNull(value) ? '' : value.toString()
	}

	public replace (string:string, search:string, replace:string) {
		return string.split(search).join(replace)
	}

	public concat (...values:any[]) :any {
		if (!values || values.length === 0) {
			return ''
		}
		if (typeof values[0] === 'string') {
			return ''.concat(...values)
		} else if (Array.isArray(values[0])) {
			return [].concat(...values)
		} else {
			const list:any[] = []
			for (const value of values) {
				list.push(value)
			}
			return list
		}
	}

	public normalize (value:string): string {
		const result:string[] = []
		// https://stackoverflow.com/questions/4547609/how-to-get-character-array-from-a-string
		const buffer = Array.from(value)
		const length = buffer.length
		for (let i = 0; i < length; i++) {
			const ascii = buffer[i].charCodeAt(0)
			if ((ascii > 96 && ascii < 122) || (ascii > 47 && ascii < 58)) {
				// minúsculas y números
				result.push(String.fromCharCode(ascii))
			} else if (ascii > 64 && ascii < 91) {
				// convierte mayúsculas en minúsculas
				result.push(String.fromCharCode(ascii + 32))
			} else if (ascii < 48 || (ascii > 90 && ascii < 97) || (ascii > 122 && ascii < 128)) {
				// caracteres excluidos
				continue
			} else if ([216, 248, 7443].includes(ascii)) {
				// Ø ø ᴓ
				result.push('0')
			} else if ([604, 605, 8488, 42923].includes(ascii)) {
				// ɜ ɝ ℨ Ɜ
				result.push('3')
			} else if ([192, 193, 194, 195, 196, 197, 224, 225, 226, 227, 228, 229, 256, 257, 258, 259, 260, 261, 395, 396, 461, 462, 512, 513, 514, 515, 550, 551, 570, 580, 593, 592, 649, 7424, 7680, 7681, 867, 7840, 7841, 7842, 7843, 11365, 11373, 11375].includes(ascii)) {
				// À Á Â Ã Ä Å à á â ã ä å Ā ā Ă ă Ą ą Ƌ ƌ Ǎ ǎ Ȁ ȁ Ȃ ȃ Ȧ ȧ Ⱥ Ʉ ɑ ɐ ʉ ᴀ Ḁ ḁ  ͣ Ạ ạ Ả ả ⱥ Ɑ Ɐ
				result.push('a')
			} else if ([384, 385, 386, 387, 579, 595, 606, 665, 7427, 7682, 7683, 7684, 7685, 7686, 7687, 8468, 8492].includes(ascii)) {
				// ƀ Ɓ Ƃ ƃ Ƀ ɓ ɞ  ʙ ᴃ Ḃ ḃ Ḅ ḅ Ḇ ḇ ℔ ℬ
				result.push('b')
			} else if ([199, 231, 262, 263, 264, 265, 266, 267, 268, 269, 390, 391, 392, 596, 597, 663, 7428, 7440, 7442, 872, 8450, 8579, 8580].includes(ascii)) {
				// Ç ç Ć ć Ĉ ĉ Ċ ċ Č č Ɔ Ƈ ƈ ɔ ɕ  ʗ ᴄ ᴐ ᴒ   ͨ  ℂ Ↄ ↄ
				result.push('c')
			} else if ([270, 271, 272, 273, 393, 394, 545, 598, 599, 7429, 873, 7690, 7691, 7692, 7693, 7694, 7695, 7696, 7697, 7698, 7699, 8517, 8518].includes(ascii)) {
				// Ď ď Đ đ  Ɖ Ɗ ȡ ɖ ɗ ᴅ  ͩ Ḋ ḋ Ḍ ḍ Ḏ ḏ Ḑ ḑ Ḓ ḓ ⅅ ⅆ
				result.push('d')
			} else if ([200, 201, 202, 203, 232, 233, 234, 235, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 338, 339, 398, 400, 477, 516, 517, 518, 519, 552, 553, 571, 572, 582, 583, 600, 603, 7431, 7432, 868, 7704, 7705, 7706, 7707, 7864, 7865, 7866, 7867, 7868, 7869, 8493, 8495, 8496, 8519, 8959].includes(ascii)) {
				// È É Ê Ëè é ê ë Ē ē Ĕ ĕ Ė ė Ę ę Ě ě  Œ œ Ǝ Ɛ ǝ Ȅ ȅ Ȇ ȇ Ȩ ȩ Ȼ ȼ Ɇ ɇ ɘ ɛ ᴇ ᴈ  ͤ Ḙ ḙ Ḛ ḛ Ẹ ẹ Ẻ ẻ Ẽ ẽ ℭ ℯ ℰ ⅇ ⋿
				result.push('e')
			} else if ([401, 402, 589, 619, 620, 607, 7710, 7711, 7835, 8497, 8498, 8526].includes(ascii)) {
				// Ƒ ƒ ɍ ɫ ɬ ɟ Ḟ ḟ ẛ ℱ Ⅎ ⅎ
				result.push('f')
			} else if ([284, 285, 286, 287, 288, 289, 290, 291, 403, 484, 485, 486, 487, 500, 501, 608, 609, 610, 666, 667, 7712, 7713, 8458, 8513, 42924].includes(ascii)) {
				// Ĝ ĝ Ğ ğ Ġ ġ Ģ ģ Ɠ Ǥ ǥ Ǧ ǧ Ǵ ǵ ɠ ɡ ɢ ʚ ʛ Ḡ ḡ ℊ ⅁ Ɡ
				result.push('g')
			} else if ([292, 293, 294, 295, 542, 543, 614, 686, 688, 668, 874, 7714, 7715, 7716, 7717, 7718, 7719, 7720, 7721, 7722, 7723, 8341, 8459, 8460, 8461, 42893, 42922].includes(ascii)) {
				// Ĥ ĥ Ħ ħ Ȟ ȟ ɦ ʮ ʰ ʜ   ͪ Ḣ ḣ Ḥ ḥ Ḧ ḧ Ḩ ḩ Ḫ ḫ ₕ ℋ ℌ ℍ Ɥ Ɦ
				result.push('h')
			} else if ([204, 205, 206, 207, 236, 237, 238, 239, 296, 297, 298, 299, 300, 301, 302, 303, 304, 407, 463, 464, 520, 521, 522, 523, 616, 618, 7433, 7522, 869, 7724, 7725, 7880, 7881, 7882, 7883, 8305, 8520].includes(ascii)) {
				// Ì Í Î Ïì í î ï Ĩ ĩ Ī ī Ĭ ĭ Į į İ Ɨ Ǐ ǐ Ȉ ȉ Ȋ ȋ ɨ ɪ ᴉ ᵢ  ͥ Ḭ ḭ Ỉ ỉ Ị ị ⁱ ⅈ
				result.push('i')
			} else if ([308, 309, 584, 585, 567, 669, 7434, 690, 8464, 8465, 8521].includes(ascii)) {
				// Ĵ ĵ Ɉ ɉ ȷ ʝ ᴊ ʲ ℐ ℑ ⅉ
				result.push('j')
			} else if ([408, 409, 488, 489, 670, 7435, 7728, 7729, 7730, 7731, 7732, 7733, 8342, 42928].includes(ascii)) {
				// Ƙ ƙ Ǩ ǩ ʞ ᴋ Ḱ ḱ Ḳ ḳ Ḵ ḵ ₖ Ʞ
				result.push('k')
			} else if ([313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 410, 564, 621, 671, 7436, 737, 7734, 7735, 7738, 7739, 7740, 7741, 8343, 8466, 8467, 8514, 8515, 11362, 42925].includes(ascii)) {
				// Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł ƚ ȴ ɭ ʟ ᴌ ˡ Ḷ ḷ Ḻ ḻ Ḽ ḽ ₗ ℒ ℓ ⅂ ⅃ Ɫ Ɬ
				result.push('l')
			} else if ([623, 624, 625, 7437, 7455, 875, 7742, 7743, 7744, 7745, 7746, 7747, 8344, 8499, 11374].includes(ascii)) {
				// ɯ ɰ ɱ  ᴍ ᴟ  ͫ Ḿ ḿ Ṁ ṁ Ṃ ṃ ₘ ℳ Ɱ
				result.push('m')
			} else if ([209, 241, 323, 324, 325, 326, 327, 328, 413, 414, 504, 505, 544, 626, 627, 628, 565, 7438, 7748, 7749, 7750, 7751, 7752, 7753, 7754, 7755, 8345, 8469].includes(ascii)) {
				// Ñ ñ Ń ń Ņ ņ Ň ň Ɲ ƞ  Ǹ ǹ Ƞ ɲ ɳ ɴ ȵ ᴎ Ṅ ṅ Ṇ ṇ Ṉ ṉ Ṋ ṋ ₙ ℕ
				result.push('n')
			} else if ([210, 211, 212, 213, 214, 242, 243, 244, 245, 246, 332, 333, 334, 335, 336, 337, 415, 416, 417, 465, 466, 524, 525, 526, 527, 558, 559, 629, 7439, 7441, 870, 7884, 7885, 7886, 7887, 8500].includes(ascii)) {
				// Ò Ó Ô Õ Ö ò ó ô õ ö Ō ō Ŏ ŏ Ő ő Ɵ Ơ ơ Ǒ ǒ Ȍ ȍ Ȏ ȏ Ȯ ȯ ɵ ᴏ ᴑ  ͦ Ọ ọ Ỏ ỏ ℴ
				result.push('o')
			} else if ([420, 421, 7448, 7764, 7765, 7766, 7767, 8346, 8472, 8473].includes(ascii)) {
				// Ƥ ƥ ᴘ Ṕ ṕ Ṗ ṗ ₚ ℘ ℙ
				result.push('p')
			} else if ([586, 587, 672, 8474, 8506].includes(ascii)) {
				// Ɋ ɋ ʠ ℚ ℺
				result.push('q')
			} else if ([340, 341, 342, 343, 344, 345, 422, 528, 529, 530, 531, 633, 634, 635, 636, 637, 638, 639, 640, 641, 588, 7449, 7450, 7523, 691, 692, 694, 876, 7768, 7769, 7770, 7771, 7774, 8475, 8476, 8477, 11364].includes(ascii)) {
				// Ŕ ŕ Ŗ ŗ Ř ř Ʀ Ȑ ȑ Ȓ ȓ ɹ ɺ ɻ ɼ ɽ ɾ ɿ ʀ ʁ Ɍ ᴙ ᴚ ᵣ ʳ ʴ ʶ  ͬ Ṙ ṙ Ṛ ṛ Ṟ ℛ ℜ ℝ Ɽ
				result.push('r')
			} else if ([346, 347, 348, 349, 350, 351, 352, 353, 536, 537, 575, 642, 738, 7775, 7776, 7777, 7778, 7779, 8347, 11390].includes(ascii)) {
				// Ś ś Ŝ ŝ Ş ş Š š Ș ș ȿ ʂ ˢ ṟ Ṡ ṡ Ṣ ṣ ₛ Ȿ
				result.push('s')
			} else if ([354, 355, 356, 357, 358, 359, 427, 428, 429, 430, 538, 539, 574, 573, 566, 647, 648, 7451, 877, 7786, 7787, 7788, 7789, 7790, 7791, 7792, 7793, 8348, 11366, 42929].includes(ascii)) {
				// Ţ ţ Ť ť Ŧ ŧ ƫ Ƭ ƭ Ʈ Ț ț Ⱦ Ƚ ȶ ʇ ʈ ᴛ  ͭ Ṫ ṫ Ṭ ṭ Ṯ ṯ Ṱ ṱ ₜ  ⱦ Ʇ
				result.push('t')
			} else if ([217, 218, 219, 220, 249, 250, 251, 252, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 431, 432, 434, 467, 468, 532, 533, 534, 535, 651, 7452, 7453, 7454, 7524, 871, 7794, 7795, 7796, 7797, 7798, 7799, 7908, 7909, 7910, 7911].includes(ascii)) {
				// Ù Ú Û Ü ù ú û ü Ũ ũ Ū ū Ŭ ŭ Ů ů Ű ű Ư ư Ʋ Ǔ ǔ Ȕ ȕ Ȗ ȗ ʋ  ᴜ ᴝ ᴞ ᵤ  ͧ Ṳ ṳ Ṵ ṵ Ṷ ṷ Ụ ụ Ủ ủ
				result.push('u')
			} else if ([652, 7456, 7525, 878, 7804, 7805, 7806, 7807].includes(ascii)) {
				// ʌ ᴠ ᵥ  ͮ Ṽ ṽ Ṿ ṿ
				result.push('v')
			} else if ([372, 373, 412, 653, 7457, 695, 7808, 7809, 7810, 7811, 7812, 7813, 7814, 7815, 7816, 7817].includes(ascii)) {
				// Ŵ ŵ Ɯ ʍ ᴡ ʷ Ẁ ẁ Ẃ ẃ Ẅ ẅ Ẇ ẇ Ẉ ẉ
				result.push('w')
			} else if ([739, 879, 7818, 7819, 7820, 7821, 10005, 10006, 10007, 10008].includes(ascii)) {
				// ˣ  ͯ Ẋ ẋ Ẍ ẍ ✕ ✖ ✗ ✘
				result.push('x')
			} else if ([221, 253, 255, 370, 371, 374, 375, 376, 435, 436, 562, 563, 590, 591, 613, 654, 655, 696, 7822, 7823, 7922, 7923, 7924, 7925, 7926, 7927, 7928, 7929, 8516].includes(ascii)) {
				// Ý ý ÿ Ų ų Ŷ ŷ Ÿ Ƴ ƴ Ȳ ȳ Ɏ ɏ ɥ ʎ ʏ ʸ Ẏ ẏ Ỳ ỳ Ỵ ỵ Ỷ ỷ Ỹ ỹ ⅄
				result.push('y')
			} else if ([377, 378, 379, 380, 381, 382, 437, 438, 548, 549, 656, 657, 576, 7458, 7824, 7825, 7826, 7827, 7828, 7829, 8484, 11391].includes(ascii)) {
				// Ź ź Ż ż Ž ž Ƶ ƶ Ȥ ȥ ʐ ʑ ɀ ᴢ Ẑ ẑ Ẓ ẓ Ẕ ẕ ℤ Ɀ
				result.push('z')
			}
		}
		return result.join('')
	}

	private _plural: { [key: string]: string } = {
		'(quiz)$': '$1zes',
		'^(ox)$': '$1en',
		'([m|l])ouse$': '$1ice',
		'(matr|vert|ind)ix|ex$': '$1ices',
		'(x|ch|ss|sh)$': '$1es',
		'([^aeiouy]|qu)y$': '$1ies',
		'(hive)$': '$1s',
		'(?:([^f])fe|([lr])f)$': '$1$2ves',
		'(shea|lea|loa|thie)f$': '$1ves',
		sis$: 'ses',
		'([ti])um$': '$1a',
		'(tomat|potat|ech|her|vet)o$': '$1oes',
		'(bu)s$': '$1ses',
		'(alias)$': '$1es',
		'(octop)us$': '$1i',
		'(ax|test)is$': '$1es',
		'(us)$': '$1es',
		'([^s]+)$': '$1s'
	}

	private _singular: { [key: string]: string } = {
		'(quiz)zes$': '$1',
		'(matr)ices$': '$1ix',
		'(vert|ind)ices$': '$1ex',
		'^(ox)en$': '$1',
		'(alias)es$': '$1',
		'(octop|vir)i$': '$1us',
		'(cris|ax|test)es$': '$1is',
		'(shoe)s$': '$1',
		'(o)es$': '$1',
		'(bus)es$': '$1',
		'([m|l])ice$': '$1ouse',
		'(x|ch|ss|sh)es$': '$1',
		'(m)ovies$': '$1ovie',
		'(s)eries$': '$1eries',
		'([^aeiouy]|qu)ies$': '$1y',
		'([lr])ves$': '$1f',
		'(tive)s$': '$1',
		'(hive)s$': '$1',
		'(li|wi|kni)ves$': '$1fe',
		'(shea|loa|lea|thie)ves$': '$1f',
		'(^analy)ses$': '$1sis',
		'((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
		'([ti])a$': '$1um',
		'(n)ews$': '$1ews',
		'(h|bl)ouses$': '$1ouse',
		'(corpse)s$': '$1',
		'(us)es$': '$1',
		s$: ''
	}

	private _uncountable: string[] = [
		'sheep',
		'fish',
		'deer',
		'moose',
		'series',
		'species',
		'money',
		'rice',
		'information',
		'equipment',
		'bison',
		'cod',
		'offspring',
		'pike',
		'salmon',
		'shrimp',
		'swine',
		'trout',
		'aircraft',
		'hovercraft',
		'spacecraft',
		'sugar',
		'tuna',
		'you',
		'wood'
	]

	private _irregular: { [key: string]: string } = {
		move: 'moves',
		foot: 'feet',
		goose: 'geese',
		sex: 'sexes',
		child: 'children',
		man: 'men',
		tooth: 'teeth',
		person: 'people'
	}

	// https://stackoverflow.com/questions/27194359/javascript-pluralize-an-english-string
	/**
    * Returns the plural of an English word.
    *
    * @export
    * @param {string} word
    * @param {number} [amount]
    * @returns {string}
    */
	public plural (word: string, amount?: number): string {
		if (amount !== undefined && amount === 1) {
			return word
		}

		// save some time in the case that singular and plural are the same
		if (this._uncountable.indexOf(word.toLowerCase()) >= 0) {
			return word
		}
		// check for irregular forms
		for (const w in this._irregular) {
			const pattern = new RegExp(`${w}$`, 'i')
			const replace = this._irregular[w]
			if (pattern.test(word)) {
				return word.replace(pattern, replace)
			}
		}
		// check for matches using regular expressions
		for (const reg in this._plural) {
			const pattern = new RegExp(reg, 'i')
			if (pattern.test(word)) {
				return word.replace(pattern, this._plural[reg])
			}
		}
		return word
	}

	/**
    * Returns the singular of an English word.
    *
    * @export
    * @param {string} word
    * @param {number} [amount]
    * @returns {string}
    */
	public singular (word: string, amount?: number): string {
		if (amount !== undefined && amount !== 1) {
			return word
		}

		// save some time in the case that singular and plural are the same
		if (this._uncountable.indexOf(word.toLowerCase()) >= 0) {
			return word
		}
		// check for irregular forms
		for (const w in this._irregular) {
			const pattern = new RegExp(`${this._irregular[w]}$`, 'i')
			const replace = w
			if (pattern.test(word)) {
				return word.replace(pattern, replace)
			}
		}
		// check for matches using regular expressions
		for (const reg in this._singular) {
			const pattern = new RegExp(reg, 'i')
			if (pattern.test(word)) {
				return word.replace(pattern, this._singular[reg])
			}
		}
		return word
	}
}

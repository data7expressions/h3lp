import { NormalizeOptions } from '../domain/base'
import { EqualOptions, IStringHelper, IValidator } from '../application'

export class StringHelper implements IStringHelper {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly validator:IValidator) {}

	public toString (value: any): string {
		return this.validator.isNull(value) ? '' : value.toString()
	}

	public replace (string: string, search: string, replace: string) {
		return string.split(search).join(replace)
	}

	public equal (a:string, b:string, options:EqualOptions = {}): boolean {
		if (options.normalize) {
			a = this.normalize(a)
			b = this.normalize(b)
			return a === b
		} else if (options.ignoreCase) {
			return a.toLowerCase() === b.toLowerCase()
		} else {
			return a === b
		}
	}

	public concat (values: any[]): any {
		if (!values || values.length === 0) {
			return ''
		}
		if (typeof values[0] === 'string') {
			return ''.concat(...values)
		} else if (Array.isArray(values[0])) {
			return [].concat(...values)
		} else {
			const list: any[] = []
			for (const value of values) {
				list.push(value)
			}
			return list
		}
	}

	public capitalize (str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	public initCap (str: string): string {
		const newStr = str.split(' ')
		let i
		const arr = []
		for (i = 0; i < newStr.length; i++) {
			arr.push(this.capitalize(newStr[i]))
		}
		return arr.join(' ')
	}

	public isUpperCase (char: string): boolean {
		const ascii = char.charCodeAt(0)
		return ascii >= 65 && ascii <= 90
	}

	public isLowerCase (char: string): boolean {
		const ascii = char.charCodeAt(0)
		return ascii >= 97 && ascii <= 122
	}

	public isCharacter (char: string): boolean {
		const ascii = char.charCodeAt(0)
		return (ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122)
	}

	public isDigit (char: string): boolean {
		const ascii = char.charCodeAt(0)
		return ascii >= 48 && ascii <= 57
	}

	public notation (source: string, type: 'camel'|'pascal' = 'camel'): string {
		const buffer = Array.from(source)
		const result = []
		let nextUpper = type === 'pascal'
		let previousIsUpper = false
		const length = buffer.length
		for (let i = 0; i < length; i++) {
			let char = buffer[i]
			const isUpper = this.isUpperCase(char)
			if (['_', '.', '-', ' '].includes(char)) {
				// It is in the case that the text begins with a special character
				if (result.length > 0) {
					nextUpper = true
					previousIsUpper = false
				}
				continue
			}
			if (isUpper && type === 'camel' && result.length === 0) {
				char = char.toLowerCase()
			} else if (previousIsUpper && isUpper) {
				char = char.toLowerCase()
			} else if (nextUpper) {
				char = this.capitalize(char)
				nextUpper = false
			}
			result.push(char)
			previousIsUpper = isUpper
		}
		return result.join('')
	}

	/**
	 * Normalize a string with utf-8 characters.
	 * @param source string to normalize
	 * @returns returns a lowercase string replacing extraneous characters with ascii characters between 97 to 121 or numbers
	 */
	public normalize (source: string, options: NormalizeOptions = {}): string {
		if (source === null || source === undefined) {
			return source
		}
		const result: string[] = []
		// https://stackoverflow.com/questions/4547609/how-to-get-character-array-from-a-string
		const buffer = Array.from(source)
		const length = buffer.length
		for (let i = 0; i < length; i++) {
			const ascii = buffer[i].charCodeAt(0)
			if (ascii > 47 && ascii < 58) {
				// numbers
				result.push(String.fromCharCode(ascii))
			} else if (ascii > 96 && ascii < 123) {
				if (options.toUpper) {
					// convert lowercase  to uppercase
					result.push(String.fromCharCode(ascii - 32))
				} else {
					result.push(String.fromCharCode(ascii))
				}
			} else if (ascii > 64 && ascii < 91) {
				if (options.toLower) {
					// convert uppercase to lowercase
					result.push(String.fromCharCode(ascii + 32))
				} else {
					result.push(String.fromCharCode(ascii))
				}
			} else if (ascii < 48 || (ascii > 90 && ascii < 97) || (ascii > 122 && ascii < 128)) {
				// excluded characters
				continue
			} else if ([216, 248, 7443].includes(ascii)) {
				// Ø ø ᴓ
				result.push('0')
			} else if ([604, 605, 8488, 42923].includes(ascii)) {
				// ɜ ɝ ℨ Ɜ
				result.push('3')
			} else if ([224, 225, 226, 227, 228, 229, 257, 259, 261, 395, 396, 462, 513, 515, 551, 593, 592, 7681, 867, 7841, 7843, 11365].includes(ascii)) {
				// à á â ã ä å ā ă ą Ƌ ƌ ǎ ȁ ȃ ȧ ɑ ɐ ḁ  ͣ ạ ả ⱥ
				result.push(options.toUpper ? 'A' : 'a')
			} else if ([384, 385, 386, 387, 7683, 7687, 8468, 7685, 595].includes(ascii)) {
				// ƀ Ɓ Ƃ ƃ ḃ ḇ ℔ ḅ ɓ
				result.push(options.toUpper ? 'B' : 'b')
			} else if ([231, 263, 265, 269, 392, 596, 597, 267, 872, 8580].includes(ascii)) {
				// ç ć ĉ č ƈ ɔ ɕ ċ  ͨ ↄ
				result.push(options.toUpper ? 'C' : 'c')
			} else if ([271, 545, 598, 599, 273, 873, 7691, 7693, 7695, 7697, 7699, 8518].includes(ascii)) {
				// ď  ȡ ɖ ɗ đ  ͩ ḋ ḍ ḏ ḑ ḓ ⅆ
				result.push(options.toUpper ? 'D' : 'd')
			} else if ([232, 233, 234, 235, 275, 277, 279, 281, 283, 339, 477, 517, 519, 553, 571, 572, 583, 600, 868, 7705, 7707, 7865, 7867, 7869, 8493, 8495, 8519].includes(ascii)) {
				// è é ê ë ē ĕ ė ę ě œ ǝ ȅ ȇ ȩ Ȼ ȼ ɇ ɘ  ͤ ḙ ḛ ẹ ẻ ẽ ℭ ℯ ⅇ
				result.push(options.toUpper ? 'E' : 'e')
			} else if ([402, 589, 619, 620, 607, 7711, 7835].includes(ascii)) {
				// ƒ ɍ ɫ ɬ ɟ ḟ ẛ
				result.push(options.toUpper ? 'F' : 'f')
			} else if ([285, 287, 289, 291, 485, 487, 501, 608, 609, 7713, 8458, 42924].includes(ascii)) {
				// ĝ ğ ġ ģ ǥ ǧ ǵ ɠ ɡ ḡ ℊ Ɡ
				result.push(options.toUpper ? 'G' : 'g')
			} else if ([293, 295, 543, 614, 686, 688, 874, 7715, 7717, 7721, 8341, 7723, 42893, 7719].includes(ascii)) {
				// ĥ ħ ȟ ɦ ʮ ʰ  ͪ ḣ ḥ ḩ  ₕ ḫ Ɥ ḧ
				result.push(options.toUpper ? 'H' : 'h')
			} else if ([297, 299, 301, 303, 464, 521, 523, 236, 237, 238, 239, 616, 7522, 869, 7725, 7433, 8305, 8520, 7883].includes(ascii)) {
				// ĩ ī ĭ į ǐ ȉ ȋ ì í î ï ɨ ᵢ  ͥ ḭ ᴉ ⁱ ⅈ ị
				result.push(options.toUpper ? 'I' : 'i')
			} else if ([585, 669, 690, 8464, 8521].includes(ascii)) {
				// ɉ ʝ ʲ ℐ ⅉ
				result.push(options.toUpper ? 'J' : 'j')
			} else if ([409, 489, 670, 7729, 7733, 8342].includes(ascii)) {
				// ƙ ǩ ʞ ḱ ḵ ₖ
				result.push(options.toUpper ? 'K' : 'k')
			} else if ([314, 316, 318, 320, 322, 410, 564, 621, 737, 8343, 7735, 7741, 8466, 8467, 7739].includes(ascii)) {
				// ĺ ļ ľ ŀ ł ƚ ȴ ɭ ˡ ₗ ḷ ḽ ℒ ℓ ḻ
				result.push(options.toUpper ? 'L' : 'l')
			} else if ([623, 624, 625, 7455, 875, 7743, 7745, 7747, 8344].includes(ascii)) {
				// ɯ ɰ ɱ ᴟ  ͫ ḿ ṁ ṃ ₘ
				result.push(options.toUpper ? 'M' : 'm')
			} else if ([241, 324, 326, 328, 414, 505, 626, 627, 565, 7749, 7751, 7753, 7755, 8345].includes(ascii)) {
				// ñ ń ņ ň ƞ ǹ ɲ ɳ ȵ ṅ ṇ ṉ ṋ ₙ
				result.push(options.toUpper ? 'N' : 'n')
			} else if ([242, 243, 244, 245, 246, 333, 335, 337, 417, 466, 525, 527, 7439, 7441, 870, 7885, 8500, 559, 629, 7887].includes(ascii)) {
				// ò ó ô õ ö ō ŏ ő ơ ǒ ȍ ȏ ᴏ ᴑ  ͦ ọ ℴ  ȯ ɵ ỏ
				result.push(options.toUpper ? 'O' : 'o')
			} else if ([421, 7448, 7765, 7767, 8346, 8472].includes(ascii)) {
				// ƥ ᴘ ṕ ṗ ₚ ℘
				result.push(options.toUpper ? 'P' : 'p')
			} else if ([586, 587, 672].includes(ascii)) {
				// Ɋ ɋ ʠ
				result.push(options.toUpper ? 'Q' : 'q')
			} else if ([341, 343, 345, 529, 531, 633, 634, 635, 636, 637, 638, 639, 7523, 691, 692, 876, 7769, 7771, 7775].includes(ascii)) {
				// ŕ ŗ ř ȑ ȓ ɹ ɺ ɻ ɼ ɽ ɾ ɿ ᵣ ʳ ʴ  ͬ ṙ ṛ ṟ
				result.push(options.toUpper ? 'R' : 'r')
			} else if ([347, 349, 351, 353, 537, 575, 642, 738, 7777, 7779, 8347].includes(ascii)) {
				// ś ŝ ş š ș ȿ ʂ ˢ ṡ ṣ ₛ
				result.push(options.toUpper ? 'S' : 's')
			} else if ([355, 357, 359, 427, 429, 429, 573, 566, 647, 648, 7451, 877, 7787, 7789, 7791, 7793, 8348, 11366].includes(ascii)) {
				// ţ ť ŧ ƫ ƭ ƭ Ƚ ȶ ʇ ʈ ᴛ  ͭ ṫ ṭ ṯ ṱ ₜ ⱦ
				result.push(options.toUpper ? 'T' : 't')
			} else if ([249, 250, 251, 252, 361, 363, 365, 367, 369, 432, 434, 468, 533, 535, 651, 7452, 7453, 7454, 7524, 871, 7795, 7797, 7799, 7909, 7911].includes(ascii)) {
				// ù ú û ü ũ ū ŭ ů ű ư Ʋ ǔ ȕ ȗ ʋ ᴜ ᴝ ᴞ ᵤ  ͧ ṳ ṵ ṷ ụ ủ
				result.push(options.toUpper ? 'U' : 'u')
			} else if ([7456, 7525, 878, 652, 7807].includes(ascii)) {
				// ᴠ ᵥ  ͮ ʌ ṿ
				result.push(options.toUpper ? 'V' : 'v')
			} else if ([373, 653, 7457, 695].includes(ascii)) {
				// ŵ ʍ ᴡ ʷ
				result.push(options.toUpper ? 'W' : 'w')
			} else if ([739, 879, 7819, 7821, 10005, 10006, 10007, 10008].includes(ascii)) {
				// ˣ  ͯ ẋ  ẍ ✕ ✖ ✗ ✘ x
				result.push(options.toUpper ? 'X' : 'x')
			} else if ([253, 255, 371, 375, 563, 435, 436, 591, 613, 654, 655, 696, 7823, 7923, 7925, 7927, 7929].includes(ascii)) {
				// ý ÿ ų ŷ ȳ Ƴ ƴ ɏ ɥ ʎ ʏ ʸ ẏ ỳ ỵ ỷ ỹ
				result.push(options.toUpper ? 'Y' : 'y')
			} else if ([378, 380, 382, 438, 549, 656, 657, 576, 7458, 7825, 7827, 7829].includes(ascii)) {
				// ź ż ž ƶ ȥ ʐ ʑ ɀ ᴢ ẑ ẓ ẕ
				result.push(options.toUpper ? 'Z' : 'z')
			} else if ([192, 193, 194, 195, 196, 197, 256, 258, 260, 461, 512, 514, 550, 570, 580, 649, 7424, 7680, 7840, 7842, 11373, 11375].includes(ascii)) {
				// À Á Â Ã Ä Å Ā Ă Ą Ǎ Ȁ Ȃ Ȧ Ⱥ Ʉ ʉ ᴀ Ḁ Ạ Ả Ɑ Ɐ
				result.push(options.toLower ? 'a' : 'A')
			} else if ([579, 606, 665, 7427, 7682, 7684, 7686, 8492].includes(ascii)) {
				// Ƀ ɞ ʙ ᴃ Ḃ Ḅ Ḇ ℬ
				result.push(options.toLower ? 'b' : 'B')
			} else if ([199, 262, 264, 266, 268, 390, 391, 663, 7428, 7440, 7442, 8450, 8579].includes(ascii)) {
				// Ç Ć Ĉ Ċ Č Ɔ Ƈ ʗ ᴄ ᴐ ᴒ ℂ Ↄ
				result.push(options.toLower ? 'c' : 'C')
			} else if ([270, 272, 393, 394, 7429, 7690, 7692, 7694, 7696, 7698, 8517].includes(ascii)) {
				// Ď Đ Ɖ Ɗ ᴅ Ḋ Ḍ Ḏ  Ḑ Ḓ ⅅ
				result.push(options.toLower ? 'd' : 'D')
			} else if ([200, 201, 202, 203, 274, 276, 278, 280, 282, 338, 398, 400, 516, 518, 552, 582, 603, 7431, 7432, 7704, 7706, 7864, 7866, 7868, 8496, 8959].includes(ascii)) {
				// È É Ê Ë Ē Ĕ Ė Ę Ě Œ Ǝ Ɛ Ȅ Ȇ Ȩ Ɇ ɛ ᴇ ᴈ Ḙ Ḛ Ẹ Ẻ Ẽ ℰ ⋿
				result.push(options.toLower ? 'e' : 'E')
			} else if ([401, 7710, 8497, 8498, 8526].includes(ascii)) {
				// Ƒ Ḟ ℱ Ⅎ ⅎ
				result.push(options.toLower ? 'f' : 'F')
			} else if ([284, 286, 288, 290, 403, 484, 486, 500, 610, 666, 667, 7712, 8513].includes(ascii)) {
				// Ĝ Ğ Ġ Ģ Ɠ Ǥ Ǧ Ǵ ɢ ʚ ʛ Ḡ ⅁
				result.push(options.toLower ? 'g' : 'G')
			} else if ([292, 294, 542, 668, 7714, 7716, 7718, 7720, 7722, 8459, 8460, 8461, 42922].includes(ascii)) {
				// Ĥ Ħ Ȟ ʜ Ḣ Ḥ Ḧ Ḩ Ḫ ℋ ℌ ℍ Ɦ
				result.push(options.toLower ? 'h' : 'H')
			} else if ([296, 298, 300, 302, 304, 407, 463, 520, 522, 204, 205, 206, 207, 618, 7724, 7880, 7881, 7882].includes(ascii)) {
				// Ĩ Ī Ĭ Į İ Ɨ Ǐ Ȉ Ȋ Ì Í Î Ï ɪ Ḭ Ỉ ỉ Ị
				result.push(options.toLower ? 'i' : 'I')
			} else if ([308, 309, 584, 567, 7434, 8465].includes(ascii)) {
				// Ĵ ĵ Ɉ ȷ ᴊ ℑ
				result.push(options.toLower ? 'j' : 'J')
			} else if ([408, 488, 7435, 7728, 7730, 7731, 7732, 42928].includes(ascii)) {
				// Ƙ Ǩ ᴋ Ḱ Ḳ ḳ Ḵ Ʞ
				result.push(options.toLower ? 'k' : 'K')
			} else if ([313, 315, 317, 319, 321, 671, 7436, 7734, 7738, 7740, 8514, 8515, 11362, 42925].includes(ascii)) {
				// Ĺ Ļ Ľ Ŀ Ł ʟ ᴌ Ḷ Ḻ Ḽ ⅂ ⅃ Ɫ Ɬ
				result.push(options.toLower ? 'l' : 'L')
			} else if ([7437, 7742, 7744, 7746, 8499, 11374].includes(ascii)) {
				// ᴍ Ḿ Ṁ Ṃ ℳ Ɱ
				result.push(options.toLower ? 'm' : 'M')
			} else if ([209, 323, 325, 327, 413, 504, 544, 628, 7438, 7748, 7750, 7752, 7754, 8469].includes(ascii)) {
				// Ñ Ń Ņ Ň Ɲ Ǹ Ƞ ɴ ᴎ Ṅ Ṇ Ṉ Ṋ ℕ
				result.push(options.toLower ? 'n' : 'N')
			} else if ([210, 211, 212, 213, 214, 332, 334, 336, 415, 416, 465, 524, 526, 558, 7884, 7886].includes(ascii)) {
				// Ò Ó Ô Õ Ö Ō Ŏ Ő Ɵ Ơ Ǒ Ȍ Ȏ Ȯ Ọ Ỏ
				result.push(options.toLower ? 'o' : 'O')
			} else if ([420, 7764, 7766, 8473].includes(ascii)) {
				// Ƥ Ṕ Ṗ ℙ
				result.push(options.toLower ? 'p' : 'P')
			} else if ([490, 491, 8474, 8506].includes(ascii)) {
				// Ǫ ǫ ℚ ℺
				result.push(options.toLower ? 'q' : 'Q')
			} else if ([340, 342, 344, 422, 528, 530, 640, 641, 588, 7449, 7450, 694, 7768, 7770, 7774, 8475, 8476, 8477, 11364].includes(ascii)) {
				// Ŕ Ŗ Ř Ʀ Ȑ Ȓ ʀ ʁ Ɍ ᴙ ᴚ ʶ Ṙ Ṛ Ṟ ℛ ℜ ℝ Ɽ
				result.push(options.toLower ? 'r' : 'R')
			} else if ([346, 348, 350, 352, 536, 7776, 7778, 11390].includes(ascii)) {
				// Ś Ŝ Ş Š Ș Ṡ Ṣ Ȿ
				result.push(options.toLower ? 's' : 'S')
			} else if ([354, 356, 358, 428, 430, 538, 574, 7786, 7788, 7790, 7792, 42929].includes(ascii)) {
				// Ţ Ť Ŧ Ƭ Ʈ Ț Ⱦ Ṫ Ṭ Ṯ  Ṱ Ʇ
				result.push(options.toLower ? 't' : 'T')
			} else if ([217, 218, 219, 220, 360, 362, 364, 366, 368, 431, 467, 532, 534, 7794, 7796, 7798, 7908, 7910].includes(ascii)) {
				// Ù Ú Û Ü Ũ Ū Ŭ Ů Ű Ư Ǔ Ȕ Ȗ Ṳ Ṵ Ṷ Ụ Ủ
				result.push(options.toLower ? 'u' : 'U')
			} else if ([7804, 7805, 7806].includes(ascii)) {
				// Ṽ ṽ Ṿ
				result.push(options.toLower ? 'v' : 'V')
			} else if ([412, 372, 7808, 7809, 7810, 7811, 7812, 7813, 7814, 7815, 7816, 7817].includes(ascii)) {
				// Ɯ Ŵ Ẁ ẁ Ẃ ẃ Ẅ ẅ Ẇ ẇ Ẉ ẉ
				result.push(options.toLower ? 'w' : 'W')
			} else if ([7818, 7820].includes(ascii)) {
				// Ẋ Ẍ
				result.push(options.toLower ? 'x' : 'X')
			} else if ([221, 370, 374, 376, 562, 590, 7822, 7922, 7924, 7926, 7928, 8516].includes(ascii)) {
				// Ý Ų Ŷ Ÿ Ȳ Ɏ Ẏ Ỳ Ỵ Ỷ Ỹ ⅄
				result.push(options.toLower ? 'y' : 'Y')
			} else if ([377, 379, 381, 437, 548, 7824, 7826, 7828, 8484, 11391].includes(ascii)) {
				// Ź Ż Ž Ƶ Ȥ Ẑ Ẓ Ẕ ℤ Ɀ
				result.push(options.toLower ? 'z' : 'Z')
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

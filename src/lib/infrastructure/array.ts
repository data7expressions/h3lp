import { IArrayHelper } from '../application'
import { Service } from '../domain'

@Service('h3lp.array')
export class ArrayHelper implements IArrayHelper {
	/**
     * Gets an array with no duplicates
     * @param array array
     * @returns array with no duplicates
     */
	public unique (array:any[]):any[] {
		return [...new Set(array)]
	}

	/**
     * Union of two arrays
     * @param array1
     * @param array2
     * @returns
     */
	public union (array1:any[], array2:any[]):any[] {
		return [...new Set(array1.concat(array2))]
	}

	/**
     * Intersection of two arrays
     * @param array1
     * @param array2
     * @returns
     */
	public intersection (array1:any[], array2:any[]):any[] {
		return array1.filter(x => array2.includes(x))
	}

	/**
     * Left difference of two arrays: arr1 - arr2
     * @param array1
     * @param array2
     * @returns
     */
	public difference (array1:any[], array2:any[]):any[] {
		return array1.filter(x => !array2.includes(x))
	}

	/**
     * Symmetric difference of two arrays: ( arr1 - arr2 ) U ( arr2 - arr1 )
     * @param array1
     * @param array2
     * @returns
     */
	public symmetricDifference (array1:any[], array2:any[]):any[] {
		return this.union(this.difference(array1, array2), this.difference(array2, array1))
	}

	/**
     *  Shuffle an array
     * @param array
     * @returns
     */
	public shuffle (array:any[]):any[] {
		return array.sort(() => Math.random() - 0.5)
	}

	public chunks (array:any[], size:number):any[][] {
		const chunks:any[] = []
		for (let i = 0; i < array.length; i += size) {
			const chunk = array.slice(i, i + size)
			chunks.push(chunk)
		}
		return chunks
	}
}

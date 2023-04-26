export interface IArrayHelper {
	unique (array:any[]):any[]
	union (array1:any[], array2:any[]):any[]
	intersection (array1:any[], array2:any[]):any[]
	difference (array1:any[], array2:any[]):any[]
	symmetricDifference (array1:any[], array2:any[]):any[]
	shuffle (array:any[]):any[]
	chunks (array:any[], size:number):any[][]
}

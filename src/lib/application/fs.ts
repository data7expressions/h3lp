import fs from 'fs'

export interface IFsHelper {
	exists (sourcePath:string):Promise<boolean>
	create (sourcePath:string):Promise<void>
	resolve (source:string):string
	read (filePath: string): Promise<string|null>
	remove (sourcePath:string):Promise<void>
	removeDir (directoryPath:string): Promise<void>
	copy (src: string, dest:string): Promise<void>
	write (sourcePath: string, content: string): Promise<void>
	writeBinary (sourcePath: string, content: Buffer): Promise<void>
	lstat (sourcePath:string):Promise<fs.Stats>
	readdir (sourcePath:string):Promise<string[]>
	isDirectory (sourcePath:string):Promise<boolean>
	dirname (sourcePath:string):string
	basename (sourcePath:string):string
	join (...paths:string[]):string
	extname (sourcePath:string):string
	move (sourcePath:string, destPath:string):Promise<void>
}

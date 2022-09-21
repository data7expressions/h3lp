import fs from 'fs'
import path from 'path'

export class FsHelper {
	public async existsPath (sourcePath:string):Promise<boolean> {
		const fullPath = this.resolvePath(sourcePath)
		return new Promise<boolean>((resolve) => {
			fs.access(fullPath, (err) => {
				if (err) {
					resolve(false)
				} else {
					resolve(true)
				}
			})
		})
	}

	public async createIfNotExists (sourcePath:string):Promise<void> {
		const fullPath = this.resolvePath(sourcePath)
		if (await this.existsPath(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public resolvePath (source:string):string {
		const _source = source.trim()
		if (_source.startsWith('.')) {
			return path.join(process.cwd(), source)
		}
		if (_source.startsWith('~')) {
			return _source.replace('~', process.env.HOME as string)
		}
		return source
	}

	public async readFile (filePath: string): Promise<string|null> {
		const fullPath = this.resolvePath(filePath)
		if (!await this.existsPath(fullPath)) {
			return null
		}
		return new Promise<string>((resolve, reject) => {
			fs.readFile(fullPath, (err, data) => err ? reject(err) : resolve(data.toString('utf8')))
		})
	}

	public async removeFile (fullPath:string):Promise<void> {
		if (!await this.existsPath(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.unlink(fullPath, err => err ? reject(err) : resolve())
		})
	}

	public async copyFile (src: string, dest:string): Promise<void> {
		if (!await this.existsPath(src)) {
			throw new Error(`not exists ${src}`)
		}
		return new Promise<void>((resolve, reject) => {
			fs.copyFile(src, dest, err => err ? reject(err) : resolve())
		})
	}

	public async writeFile (filePath: string, content: string): Promise<void> {
		const dir = path.dirname(filePath)
		if (!await this.existsPath(dir)) {
			await this.mkdir(dir)
		}
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(filePath, content, { encoding: 'utf8' }, err => err ? reject(err) : resolve())
		})
	}

	public async mkdir (fullPath:string):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public async lstat (fullPath:string):Promise<fs.Stats> {
		return new Promise<fs.Stats>((resolve, reject) => {
			fs.lstat(fullPath, (err, stats) => err
				? reject(err)
				: resolve(stats))
		})
	}
}

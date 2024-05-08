import fs from 'fs'
import path from 'path'
import { IFsHelper } from '../application'
import { Service } from '../domain'

@Service('h3lp.fs')
export class FsHelper implements IFsHelper {
	public async exists (sourcePath:string):Promise<boolean> {
		const fullPath = this.resolve(sourcePath)
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

	public dirname (sourcePath:string):string {
		return path.dirname(sourcePath)
	}

	public basename (sourcePath:string):string {
		return path.basename(sourcePath)
	}

	public join (...paths:string[]):string {
		return path.join(...paths)
	}

	public extname (sourcePath:string):string {
		return path.extname(sourcePath)
	}

	public async move (sourcePath:string, destPath:string):Promise<void> {
		const _sourcePath = this.resolve(sourcePath)
		const _destPath = this.resolve(destPath)
		if (!await this.exists(_sourcePath)) {
			throw new Error(`not exists ${sourcePath}`)
		}
		return new Promise<void>((resolve, reject) => {
			fs.rename(_sourcePath, _destPath, err => err ? reject(err) : resolve())
		})
	}

	public async create (sourcePath:string):Promise<void> {
		const fullPath = this.resolve(sourcePath)
		if (await this.exists(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(fullPath, { recursive: true }, err => err ? reject(err) : resolve())
		})
	}

	public resolve (source:string):string {
		const _source = source.trim()
		if (_source.startsWith('.')) {
			return path.join(process.cwd(), source)
		}
		if (_source.startsWith('~')) {
			return _source.replace('~', process.env.HOME as string)
		}
		return source
	}

	public async read (filePath: string): Promise<string|null> {
		const fullPath = this.resolve(filePath)
		if (!await this.exists(fullPath)) {
			return null
		}
		return new Promise<string>((resolve, reject) => {
			fs.readFile(fullPath, (err, data) => err ? reject(err) : resolve(data.toString('utf8')))
		})
	}

	public async remove (sourcePath:string):Promise<void> {
		const fullPath = this.resolve(sourcePath)
		if (!await this.exists(fullPath)) { return }
		return new Promise<void>((resolve, reject) => {
			fs.unlink(fullPath, err => err ? reject(err) : resolve())
		})
	}

	public async removeDir (directoryPath:string): Promise<void> {
		try {
			const stats = await this.lstat(directoryPath)
			if (!stats.isDirectory()) {
				await this.remove(directoryPath)
				return
			}
			const files = await this.readdir(directoryPath)
			await Promise.all(files.map(async (file) => {
				const filePath = path.join(directoryPath, file)
				await this.removeDir(filePath)
			}))
			return new Promise<void>((resolve, reject) => {
				fs.rmdir(directoryPath, err => err ? reject(err) : resolve())
			})
		} catch (err) {
			console.error(`Error removing directory ${directoryPath}: ${err}`)
		}
	}

	public async copy (src: string, dest:string): Promise<void> {
		const _src = this.resolve(src)
		const _dest = this.resolve(dest)
		if (!await this.exists(_src)) {
			throw new Error(`not exists ${src}`)
		}
		return new Promise<void>((resolve, reject) => {
			fs.copyFile(_src, _dest, err => err ? reject(err) : resolve())
		})
	}

	public async write (sourcePath: string, content: string): Promise<void> {
		const filePath = this.resolve(sourcePath)
		const dir = path.dirname(filePath)
		if (!await this.exists(dir)) {
			await this.create(dir)
		}
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(filePath, content, { encoding: 'utf8' }, err => err ? reject(err) : resolve())
		})
	}

	public async writeBinary (sourcePath: string, content: Buffer): Promise<void> {
		const filePath = this.resolve(sourcePath)
		const dir = path.dirname(filePath)
		if (!await this.exists(dir)) {
			await this.create(dir)
		}
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(filePath, content, err => err ? reject(err) : resolve())
		})
	}

	public async lstat (sourcePath:string):Promise<fs.Stats> {
		const fullPath = this.resolve(sourcePath)
		return new Promise<fs.Stats>((resolve, reject) => {
			fs.lstat(fullPath, (err, stats) => err
				? reject(err)
				: resolve(stats))
		})
	}

	public async readdir (sourcePath:string):Promise<string[]> {
		const fullPath = this.resolve(sourcePath)
		return new Promise((resolve, reject) => {
			fs.readdir(fullPath, (err, items) => err
				? reject(err)
				: resolve(items))
		})
	}

	public async isDirectory (sourcePath:string): Promise<boolean> {
		if (await this.exists(sourcePath)) {
			return fs.lstatSync(sourcePath).isDirectory()
		}
		return path.parse(sourcePath).ext.toLocaleLowerCase() === ''
	}
}

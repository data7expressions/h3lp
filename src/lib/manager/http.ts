import { Helper } from './helper'
import https from 'https'
import http from 'http'

export class HttpHelper {
	private helper: Helper
	constructor (helper: Helper) {
		this.helper = helper
	}

	public async get (uri: any): Promise<any> {
		// https://www.geeksforgeeks.org/node-js-https-request-function/
		return new Promise<string>((resolve, reject) => {
			let data = ''
			// https://www.geeksforgeeks.org/node-js-url-method/
			// const _url = new url.URL(uri)
			// const options = {
			// hostname: _url.hostname,
			// port: _url.protocol === 'https' ? 443 : 80,
			// path: _url.pathname,
			// method: 'GET'
			// // https://levelup.gitconnected.com/how-to-resolve-certificate-errors-in-nodejs-app-involving-ssl-calls-781ce48daded
			// // https://levelup.gitconnected.com/how-to-resolve-certificate-errors-in-nodejs-app-involving-ssl-calls-781ce48daded
			// // NO FUNCIONO
			// // rejectUnauthorized: false
			// }
			const protocol = new URL(uri).protocol
			const lib = protocol === 'https:' ? https : http
			const req = lib.request(uri, res => {
				res.on('data', chunk => {
					data = data + chunk.toString()
				})
				res.on('end', () => {
					resolve(data)
				})
			})
			req.on('error', error => {
				reject(error)
			})
			req.end()
		})
	}

	public decodeUrl (source:string) {
		let url = source
		// https://splunktool.com/json-schema-validation-with-escaped-characters-in-patterns-fails
		if (url.includes('~1')) {
			url = this.helper.replace(url, '~1', '/')
		}
		if (url.includes('~0')) {
			url = this.helper.replace(url, '~0', '~')
		}
		// https://www.geeksforgeeks.org/how-to-retain-special-characters-in-expressjs-router-url-request/
		// https://codeforgeek.com/how-to-encode-decode-url-javascript/
		if (url.includes('%')) {
			// part = encodeURI(part)
			url = decodeURI(url)
		}
		return url
	}

	public urlJoin (source:string, path:string) : string {
		const isUri = /(https?:\/\/[^\s]+)/g
		if (isUri.test(source)) {
			return new URL(path, source).href
		}
		const pathParts = path.split('/')
		const sourceParts = source.split('/')
		const newParts = sourceParts.splice(1, sourceParts.length - (pathParts.length + 1))
		return newParts.join('/') + '/' + pathParts.join('/')
	}
}

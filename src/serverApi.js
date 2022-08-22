// Apparently the cheqroom-core npm library is purpose built for the browser (bombs out in node)
// We are going to call the api directly, as demonstrated here: https://github.com/CHECKROOM/checkroom_core_js/issues/2
import fetch from 'node-fetch'
import { joinWithNewLines } from './utility.js'

const API_URL = 'https://app.cheqroom.com/api/v2_5'

const post = async (url, data, headers) => {
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...headers
		},
		method: 'POST',
		body: JSON.stringify(data)
	})
	return response.json();
}

export class Api {
	userId = null
	jwt = null

	constructor(userId, jwt) {
		this.userId = userId
		this.jwt = jwt
	}

	async auth(user, password) {
		return new Promise((resolve, reject) => {
			post(`${API_URL}/authenticate`, { user, password })
				.then(response => {
					const { status, message } = response

					if (status == 'ERROR') {
						reject(joinWithNewLines(status, message))
					}
					else {
						const { userId, jwt } = response.data;
						this.userId = userId
						this.jwt = jwt
						resolve()
					}
				})
		})
	}

	async apiCall(endpoint, data) {
		return post(`${API_URL}/${this.userId}/null/jwt/${endpoint}`, data, {
			'Authorization': `Bearer ${this.jwt}`
		})
	}

	async getData(dataName, limit = 20, skip = 0) {
		let response = await this.apiCall(`${dataName}/search`, {
			_limit: limit,
			_skip: skip 
		})

		const { httpError, status, message } = response

		if (httpError) {
			throw joinWithNewLines(status, message, httpError)
		}
		else return response.docs
	}

	async getAllData(dataName) {
		let docsLength = 0
		let allDocs = []
		let skip = 0

		do {
			let docs = await this.getData(dataName, 100, skip)
			allDocs = allDocs.concat(docs)
			docsLength = docs.length
			skip += docsLength
		} while (docsLength > 0)

		return allDocs
	}

	async getItems(limit, skip) {
		return this.getData(`items`, limit, skip) 
	}

	async getAllItems() {
		return this.getAllData(`items`)
	}

	async getReservations(limit, skip) {
		return this.getData(`reservations`, limit, skip) 
	}

	async getAllReservations() {
		return this.getAllData(`reservations`)
	}

	async getCustomers(limit, skip) {
		return this.getData(`customers`, limit, skip) 
	}

	async getAllCustomers() {
		return this.getAllData(`customers`)
	}
}

export default Api

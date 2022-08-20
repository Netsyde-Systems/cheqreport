// Apparently the cheqroom-core npm library is purpose built for the browser (bombs out in node)
// We are going to call the api directly, as demonstrated here: https://github.com/CHECKROOM/checkroom_core_js/issues/2

import fetch from 'node-fetch'

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

	async auth(user, password) {
		return new Promise((resolve, reject) => {
			post(`${API_URL}/authenticate`, { user, password })
				.then(resp => {
					const { jwt, userId } = resp.data;
					this.jwt = jwt
					this.userId = userId
					resolve()
				})
		})
	}

	async apiCall(endpoint, data) {
		return post(`${API_URL}/${this.userId}/null/jwt/${endpoint}`, data, {
			'Authorization': `Bearer ${this.jwt}`
		})
	}

	async getData(dataName, limit = 20, skip = 0) {
		return this.apiCall(`${dataName}/search`, {
			_limit: limit,
			_skip: skip 
		})
	}

	async getAllData(dataName) {
		let docsLength = 0
		let allDocs = []
		let skip = 0

		do {
			let { docs, count } = await this.getData(dataName, 100, skip)
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

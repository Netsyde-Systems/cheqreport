// Deprecated, since cheqroom-core doesn't appear to play nice with NodeJS 
// Leaving in place for now in case we want to make compatible in browser in the future
const cr = require('cheqroom-core')

var baseUrl = 'https://api.cheqroom.com/api/v2_5'

class Api {

	constructor() {
		this.ajax = new cr.api.ApiAjax()
		this.auth = new cr.api.ApiAuthV2({ ajax: ajax, urlAuth: baseUrl + '/authenticate' })
	}

	auth(username, password) {
		return new Promise((resolve, reject) => {
			this.auth.authenticate(username, password)
				.done(function (data) {
					this.authUser = new cr.api.ApiUser({ userId: data.userId, userToken: data.token });
					resolve()
				})
		})
	}

	getOrders() {
		return new Promise((resolve, reject) => {
			const dsOrders = new cr.api.ApiDataSource({ collection: 'orders', ajax: this.ajax, user: this.authUser, urlApi: baseUrl })

			dsOrders.list("open_orders").done(resolve)
		})
	}
}

exports.Api = Api

module.exports = Api

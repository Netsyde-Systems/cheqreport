export class CostPerProjectReport {

	constructor(customers, items, reservations) {
		this._details = this.createDetails(customers, items, reservations)
		this._summary = this.createSummary(this._details)
	}

	createDetails(customers, items, reservations) {

		const details = reservations.flatMap(reservation => reservation.items.map(itemId => {
			let detailRow = {}

			let item = items.find(item => item._id == itemId)
			let customer = customers.find(customer => customer._id == reservation.customer)

			if (item) {
				detailRow['Project Number / Name'] = reservation.fields['Project Number']
				detailRow['Customer name'] = customer?.name ?? 'Unknown'
				detailRow['Equipment / Item'] = item.name
				detailRow['Checkout Date'] = reservation.fromDate
				detailRow['Checkin Date'] = reservation.toDate

				const durationInMs = new Date(reservation.toDate) - new Date(reservation.fromDate)
				let durationInDays = durationInMs / 1000 / 60 / 24
				durationInDays = Math.round(durationInDays * 100) / 100

				detailRow['Total Duration'] = durationInDays
				detailRow['Purchase Price'] = item.purchasePrice
				detailRow['Rental Percentage'] = reservation.fields['Rental Percentage']
			}
			else {
				detailRow.Error = `Could not find item with ID ${itemId}`
			}

			return detailRow
		}))

		return details
	}

	createSummary(details) {

	}

	get details() {
		return this._details
	}

	get summary() {
		return this._summary
	}
}

export default CostPerProjectReport
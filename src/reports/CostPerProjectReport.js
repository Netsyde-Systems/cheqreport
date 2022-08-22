import { makeDictionary, getDurationInDays, getRentalPercentageParts, getRentalMagnitudePerDay, roundTo } from '../utility.js'

export class CostPerProjectReport {
	constructor(customers, items, reservations) {
		const { details, summary }  = createReport(customers, items, reservations)

		this._details = details
		this._summary = summary
	}

	get details() {
		return this._details
	}

	get summary() {
		return this._summary
	}
}

export default CostPerProjectReport


function createReport(customers, items, reservations) {

	const customerDictionary = makeDictionary(customers, c => c._id)
	const itemDictionary = makeDictionary(items, i => i._id)

	const summaryReportDictionary = {}

	const details = reservations.flatMap(reservation => reservation.items.map(itemId => {
		let detailRow = {}
		let summaryRow = summaryReportDictionary[reservation._id] || {}

		if (!summaryReportDictionary[reservation._id]) {
			summaryReportDictionary[reservation._id] = summaryRow
		}

		let item = itemDictionary[itemId]
		let customer = customerDictionary[reservation.customer]

		if (item) {
			detailRow['ReservationId'] = reservation._id
			summaryRow['ReservationId'] ??= reservation._id

			detailRow['Project Number / Name'] = reservation.fields['Project Number']
			summaryRow['Project Number / Name'] ??= reservation.fields['Project Number']

			detailRow['Customer name'] = customer?.name ?? 'Unknown'
			summaryRow['Customer name'] ??= customer?.name ?? 'Unknown'

			detailRow['ItemId'] = itemId
			detailRow['Equipment / Item'] = item.name

			detailRow['Checkout Date'] = reservation.fromDate
			summaryRow['Checkout Date'] ??= reservation.fromDate

			detailRow['Checkin Date'] = reservation.toDate
			summaryRow['Checkin Date'] ??= reservation.toDate

			const rentalDurationInDays = getDurationInDays(reservation.fromDate, reservation.toDate)
			detailRow['Total Duration (Days)'] = rentalDurationInDays
			summaryRow['Total Duration (Days)'] ??= rentalDurationInDays

			detailRow['Purchase Price'] = item.purchasePrice
			summaryRow['Purchase Price'] ??= 0
			summaryRow['Purchase Price'] += item.purchasePrice

			const rentalPercentage = reservation.fields['Rental Percentage']
			detailRow['Rental Percentage'] = rentalPercentage

			const { rentalMagnitude, rentalUnit } = getRentalPercentageParts(rentalPercentage)
			detailRow['Rental Magnitude'] = rentalMagnitude
			detailRow['Rental Unit'] = rentalUnit

			const rentalMagnitudePerDay = getRentalMagnitudePerDay(rentalMagnitude, rentalUnit)
			detailRow['Rental Magnitude / Day'] = rentalMagnitudePerDay

			const rentalCostPerDay = rentalMagnitudePerDay * item.purchasePrice
			detailRow['Rental Cost / Day'] = rentalCostPerDay
			summaryRow['Rental Cost / Day'] ??= 0
			summaryRow['Rental Cost / Day'] += rentalCostPerDay

			const rentalCost = roundTo(rentalDurationInDays * rentalMagnitudePerDay * item.purchasePrice, 2) 
			detailRow['Rental Cost'] = rentalCost
			summaryRow['Rental Cost'] ??= 0
			summaryRow['Rental Cost'] += rentalCost
		}
		else {
			detailRow.Error = `Could not find item with ID ${itemId}`
		}

		return detailRow
	}))

	const summary = Object.values(summaryReportDictionary)
		.map(s => {
			s['Rental Cost / Day'] = roundTo(s['Rental Cost / Day'], 2)
			return s
		})

	return { details, summary }
}

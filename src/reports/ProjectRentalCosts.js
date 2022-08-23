import { makeDictionary, getDurationInDays, getRentalPercentageParts, getRentalMagnitudePerDay, roundTo } from '../utility.js'

export class ProjectRentalCosts {
	constructor(customers, items, reservations) {
		const { details, summary }  = createReport(customers, items, reservations)

		this._details = details
		this._summary = summary
	}

	get details() {
		return this._details
	}

	get detailsFormats() {
		return { 
			I: '$0.00', 
			K: '0.00%', 
			M: '0.00%', 
			N: '$0.00', 
			O: '$0.00'
		}
	}

	get summary() {
		return this._summary
	}

	get summaryFormats() {
		return { 
			G: '$0.00', 
			H: '$0.00', 
			I: '$0.00'
		}
	}
}

export default ProjectRentalCosts


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

			const fromDate = new Date(reservation.fromDate)
			detailRow['Checkout Date'] = fromDate
			summaryRow['Checkout Date'] ??= fromDate

			const toDate = new Date(reservation.toDate)
			detailRow['Checkin Date'] = toDate
			summaryRow['Checkin Date'] ??= toDate

			const rentalDurationInDays = getDurationInDays(fromDate, toDate)
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

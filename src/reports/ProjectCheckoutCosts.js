// *************************************
// Project Rental Costs Report
// Defines report data and format
// *************************************

import { makeDictionary, getDurationInDays, getRentalPercentageParts, getRentalMagnitudePerDay, roundTo } from '../utility.js'

const CELL_FORMATS = {
	CURRENCY: '$0.00', 
	PERCENTAGE: '0.00%'
}

export class ProjectCheckoutCosts {

	constructor(customers, items, orders) {
		// report is created when we initialize an instance of the calls
		const { details, summary }  = createReport(customers, items, orders)

		this._details = details
		this._summary = summary
	}

	get details() {
		return this._details
	}

	get detailsFormats() {
		return { 
			I: CELL_FORMATS.CURRENCY,
			K: CELL_FORMATS.PERCENTAGE,
			M: CELL_FORMATS.PERCENTAGE,
			N: CELL_FORMATS.CURRENCY,
			O: CELL_FORMATS.CURRENCY,
		}
	}

	get summary() {
		return this._summary
	}

	get summaryFormats() {
		return { 
			G: CELL_FORMATS.CURRENCY,
			H: CELL_FORMATS.CURRENCY,
			I: CELL_FORMATS.CURRENCY
		}
	}
}

export default ProjectCheckoutCosts


function createReport(customers, items, orders) {

	// create dictionaries to avoid having to cycle through long lists of items repeatedly
	const customerDictionary = makeDictionary(customers, c => c._id)
	const itemDictionary = makeDictionary(items, i => i._id)

	// prepare a summary report dictionary so that we don't have to 
	// go through the details report a second time to summarize
	const summaryReportDictionary = {}

	// The details report has a row for every item in each reservation
	const details = orders.flatMap(order => order.items.map(itemId => {
		let detailRow = {}

		// we may have already created a summary row for this item row
		let summaryRow = summaryReportDictionary[order._id] || {}
		if (!summaryReportDictionary[order._id]) {
			summaryReportDictionary[order._id] = summaryRow
		}

		// find corresponding item and customer in our dictionaries
		let item = itemDictionary[itemId]
		let customer = customerDictionary[order.customer]

		if (item) {
			// add detail row data (and summary row data if not already added)
			detailRow['OrderNumber'] = order.number
			summaryRow['OrderNumber'] ??= order.number

			detailRow['Project Number / Name'] = order.fields['Project Number']
			summaryRow['Project Number / Name'] ??= order.fields['Project Number']

			detailRow['Customer name'] = customer?.name ?? 'Unknown'
			summaryRow['Customer name'] ??= customer?.name ?? 'Unknown'

			detailRow['ItemId'] = itemId
			detailRow['Equipment / Item'] = item.name

			summaryRow['Equipment / Items'] ??= '|'
			summaryRow['Equipment / Items'] += ` ${item.name} |`

			const fromDate = new Date(order.started)
			detailRow['Order Started'] = fromDate
			summaryRow['Order Started'] ??= fromDate

			let toDate = null
			if (order.finished) {
				toDate = new Date(order.finished)
				detailRow['Order Finished'] = toDate
				summaryRow['Order Finished'] ??= toDate
			}

			let rentalDurationInDays = null
			if (toDate) {
				rentalDurationInDays = getDurationInDays(fromDate, toDate)
				detailRow['Total Duration (Days)'] = rentalDurationInDays
				summaryRow['Total Duration (Days)'] ??= rentalDurationInDays
			}

			detailRow['Purchase Price'] = item.purchasePrice
			summaryRow['Purchase Price'] ??= 0
			summaryRow['Purchase Price'] += item.purchasePrice

			const rentalPercentage = order.fields['Rental Percentage']
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

			if (rentalDurationInDays) {
				const rentalCost = roundTo(rentalDurationInDays * rentalMagnitudePerDay * item.purchasePrice, 2)
				detailRow['Rental Cost'] = rentalCost
				summaryRow['Rental Cost'] ??= 0
				summaryRow['Rental Cost'] += rentalCost
			}

			detailRow['OrderId'] = order._id
			summaryRow['OrderId'] ??= order._id

			detailRow['ReservationId'] = order.reservation
			summaryRow['ReservationId'] ??= order.reservation

			summaryRow['Comments'] ??= order.fields.Comments
		}
		else {
			detailRow.Error = `Could not find item with ID ${itemId}`
		}

		return detailRow
	}))

	// do a final rounding operation to format data nicely
	const summary = Object.values(summaryReportDictionary)
		.map(s => {
			s['Rental Cost / Day'] = roundTo(s['Rental Cost / Day'], 2)
			return s
		})

	return { details, summary }
}

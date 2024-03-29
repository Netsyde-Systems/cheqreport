// ***********************************
// Useful reusable logic and functions
// ***********************************

import os from 'os'
import path from 'path'

const homedir = os.homedir()

export function makeDictionary(arr, keySeletor) {
	const dictionary = arr.reduce((dic, obj) => {
		dic[keySeletor(obj)] = obj
		return dic
	}, {})
	return dictionary
}

export const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

export function getDurationInDays(fromDate, toDate) {
	const durationInMs = toDate - fromDate
	const durationInDays = durationInMs / MILLISECONDS_IN_A_DAY
	const roundedDurationInDays = roundTo(durationInDays, 2) 
	return roundedDurationInDays
}

export function getRentalPercentageParts(rentalPercentage) {
	// TODO: investigate why rentalPercentage is sometimes undefined
	// appears to have been a one-off issue...
	// if (!rentalPercentage) return [undefined, undefined]

	const [rentalMagnitudeString, rentalUnit] = rentalPercentage.split('/').map(s => s.trim())
	const rentalMagnitude = Number(rentalMagnitudeString.replace('%', '')) / 100
	return { 
		rentalMagnitude, 
		rentalUnit 
	}
}

export function getRentalMagnitudePerDay(rentalMagnitude, rentalUnit) {
	const daysInUnit = {
		'Day': 1, 
		'Week': 7, 
		'Month': 30
	}
	return rentalMagnitude / daysInUnit[rentalUnit]
}

export function roundTo(value, numDecimals) {
	const powTen = 10 ** numDecimals
	return Math.round(value * powTen) / powTen
}

export function defaultFilepath(reportName) {
	const timestampedFilename = timestampFilename(reportName, 'xlsx') 
	const fullpath = path.join(homedir, timestampedFilename)
	return fullpath
}

export function timestampFilename(filename, ext) {
	const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "_")
	const stampedFilename =  filename + "_" + timestamp + "." + ext
	return stampedFilename
}

export function joinWithNewLines() {
	const args = Array.prototype.slice.call(arguments)
	const joined = args.join("\n")
	return joined
}
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

export function getDurationInDays(fromDateString, toDateString) {
	const durationInMs = new Date(toDateString) - new Date(fromDateString)
	const durationInDays = durationInMs / 1000 / 60 / 60 / 24
	const roundedDurationInDays = Math.round(durationInDays * 100) / 100
	return roundedDurationInDays
}

export function getRentalPercentageParts(rentalPercentage) {
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
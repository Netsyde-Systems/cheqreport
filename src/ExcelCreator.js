import * as fs from 'fs'
import { utils, writeFile, set_fs } from 'xlsx'

// super annoying that this isn't made more clear earlier in the docs
// https://docs.sheetjs.com/docs/solutions/output
set_fs(fs)

export class ExcelCreator {
	_workbook = null

	constructor() {
		this._workbook = utils.book_new()
	}

	addSheet(name, rows, formats) {
		const worksheet = utils.json_to_sheet(rows)

		if (formats) {
			Object.entries(formats).forEach(([columnName, columnFormat]) => {
				formatColumn(worksheet, columnName, columnFormat)
			})
		}

		utils.book_append_sheet(this._workbook, worksheet, name)
	}

	saveFile(filename) {
		writeFile(this._workbook, filename)
	}
}

export default ExcelCreator

// incorporated and fixed from https://stackoverflow.com/a/66983974
function formatColumn(worksheet, col, fmt) {
	const range = utils.decode_range(worksheet['!ref'])
	// note: range.s.r + 1 skips the header row
	for (let row = range.s.r + 1; row <= range.e.r; ++row) {
		// this wasn't working
		// const ref = utils.encode_cell({ r: row, c: col })
		const ref = `${col}${row}`
		if (worksheet[ref] && worksheet[ref].t === 'n') {
			worksheet[ref].z = fmt
		}
	}
}

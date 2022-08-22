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

	addSheet(rows, name) {
		const worksheet = utils.json_to_sheet(rows)

		utils.book_append_sheet(this._workbook, worksheet, name)
	}

	saveFile(filename) {
		writeFile(this._workbook, filename)
	}
}

export default ExcelCreator
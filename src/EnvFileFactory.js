// *******************************************************
// Handles reading and writing userId and jwt to .env file
// *******************************************************

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse, stringify } from 'envfile'

// we hack dirname because it's not available when using ECM modules
// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ENV_FILE_PATH = path.join(__dirname, '..', '.env')

function parseDotEnv() {
	if (!fs.existsSync(ENV_FILE_PATH)) {
		fs.writeFileSync(ENV_FILE_PATH, '')
	}
	const envContents = fs.readFileSync(ENV_FILE_PATH)
	const parsed = parse(envContents)
	return parsed
}

function writeDotEnv(envObject) {
	fs.writeFileSync(ENV_FILE_PATH, stringify(envObject))
}

export class EnvFileFactory {
	userId = null
	jwt = null

	constructor() {
		const parsed = parseDotEnv()
		const { userId, jwt } = parsed
		this.userId = userId
		this.jwt = jwt
	}

	updateEnvFile() {
		const { jwt, userId } = this
		writeDotEnv({ jwt, userId })
	}
}

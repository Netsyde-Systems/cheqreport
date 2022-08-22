import fs from 'fs'
import { parse, stringify } from 'envfile'

function parseDotEnv() {
	const envContents = fs.readFileSync('.env')
	const parsed = parse(envContents)
	return parsed
}

function writeDotEnv(envObject) {
	fs.writeFileSync('.env', stringify(envObject))
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

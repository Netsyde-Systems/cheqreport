#!/usr/bin/env node

// we use yargs for console command parsing
// https://yargs.js.org/
// brutal import syntax: https://stackoverflow.com/a/70481818
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

// we use dotevn to parse the .env file which can store user/pass info
import dotenv from 'dotenv'

dotenv.config()

// const BrowserApi = require('../src/browserApi')
import ServerApi from '../src/serverApi.js'
import { CostPerProjectReport } from '../src/reports/CostPerProjectReport.js'

import { response as customersResponse  } from '../dataSamples/customers_search.js'
import { response as itemsResponse } from '../dataSamples/items_search.js'
import { response as reservationsResponse  } from '../dataSamples/reservations_search.js'

yargs
	.scriptName("cheqreport")
	.usage('$0 <cmd> [args]')

	// runs report of user's choice
	.command('run [reportname]', 'Runs custom report', (yargs) => {
		yargs.positional('reportname', {
			type: 'string',
			default: 'projectrental',
			describe: 'the name of the custom report'
		})
	}, async function (argv) {
		console.log('reportname: ', argv.reportname)
		console.log('user: ', process.env.USER)
		console.log('pass: ', process.env.PASS)

		/*
		const api = new ServerApi()
		await api.auth(process.env.USER, process.env.PASS)

		const items = await api.getAllItems()
		const reservations = await api.getAllReservations()
		const customers = await api.getCustomers()
		*/

		const customers = customersResponse.docs
		const items = itemsResponse.docs
		const reservations = reservationsResponse.docs

		const report = new CostPerProjectReport(customers, items, reservations)


		const test = 7
	})

	// authenticates user
	.command('auth <user> <password>', 'Authenticates user against cheqroom API', (yargs) => {
		yargs.positional('user', {
			type: 'string',
			alias: 'u', 
			describe: 'cheqroom account email'
		})
		yargs.positional('password', {
			type: 'string',
			alias: 'p', 
			describe: 'cheqroom account password'
		})
	}, function (argv) {
		console.log(`user: ${argv.user} password: ${argv.password}`)
	})

	// setup help as default command
	.command('$0', 'Default command is help', (yargs) => {
	}, function () {
		yargs.showHelp()
	})

	.help()
	.argv

#!/usr/bin/env node

// *************************************
// Main program entry point
// Parses user input and provides output
// *************************************


// we use yargs for console command parsing
// https://yargs.js.org/
// brutal import syntax: https://stackoverflow.com/a/70481818
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

// const BrowserApi = require('../src/browserApi')
import ServerApi from '../src/serverApi.js'
import { ProjectReservationCosts } from '../src/reports/ProjectReservationCosts.js'
import { ProjectCheckoutCosts } from '../src/reports/ProjectCheckoutCosts.js'

const USE_SAMPLE_DATA = false

import { docs as customerSamples } from '../dataSamples/customers_search.js'
import { docs as itemSamples } from '../dataSamples/items_search.js'
import { docs as reservationSamples } from '../dataSamples/reservations_search.js'
import { docs as orderSamples } from '../dataSamples/orders_search.js'

import { defaultFilepath } from '../src/utility.js'
import { ExcelCreator } from '../src/ExcelCreator.js'
import { EnvFileFactory } from '../src/EnvFileFactory.js'

yargs
	.scriptName("cheqreport")
	.usage('$0 <cmd> [args]')

	// runs report of user's choice
	.command('run [reportname]', 'Runs custom report', (yargs) => {
		yargs.positional('reportname', {
			type: 'string',
			default: 'reservationcosts',
			describe: 'the name of the custom report'
		})
	}, async function (argv) {
		// TODO: add support for different report types in the future

		// pull reportname from command line
		const reportname = argv.reportname

		// pull user's id and token from .env file
		const envFactory = new EnvFileFactory()

		if (!envFactory.userId || !envFactory.jwt) {
			console.error("You must first authenticate via 'cheqreport auth <user> <password>'")
		}
		else {

			const api = new ServerApi(envFactory.userId, envFactory.jwt)

			try {
				console.log('Loading customers...')
				const customers = USE_SAMPLE_DATA ? customerSamples : await api.getAllCustomers()

				console.log('Loading equipment...')
				const items = USE_SAMPLE_DATA ? itemSamples : await api.getAllItems()

				var report = null

				switch (reportname) {
					case 'reservationcosts': 
						console.log('Loading reservations...')
						const reservations = USE_SAMPLE_DATA ? reservationSamples : await api.getAllReservations()

						console.log(`Creating ${reportname} Report`)
						report = new ProjectReservationCosts(customers, items, reservations)
						break

					case 'checkoutcosts': 
						console.log('Loading check-outs...')
						const orders = USE_SAMPLE_DATA ? orderSamples : await api.getAllOrders()

						console.log(`Creating ${reportname} Report`)
						report = new ProjectCheckoutCosts(customers, items, orders)
						break

					default: 
						throw new Error(`Unknown report type: ${reportname}.  Supported report types are: reservationcosts & checkoutcosts`)
				}

				const excelCreator = new ExcelCreator()

				excelCreator.addSheet('Summary', report.summary, report.summaryFormats)
				excelCreator.addSheet('Details', report.details, report.detailsFormats)

				// save excel output as timestamped file to user's home directory
				const filename = defaultFilepath(reportname)
				excelCreator.saveFile(filename)

				console.log(`Your cheqreport has been successfully saved to: ${filename}`)
			}
			catch (ex) {
				console.error(ex)
				console.error("It's possible your auth token has expired and you may have to reauthenticate via 'cheqreport auth <user> <password>'")
			}

		}
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
	}, async function (argv) {

		// pull credentials from command line
		const { user, password } = argv

		const api = new ServerApi()

		try {
			// attempt to authenticate
			await api.auth(user, password)

			// save id and token if successful
			const envFactory = new EnvFileFactory()
			envFactory.userId = api.userId
			envFactory.jwt = api.jwt
			envFactory.updateEnvFile()

			console.log('You have successfully authenticated; you may now generate a cheqreport.')
		}
		catch (ex) {
			console.error(ex)
		}
	})

	// setup help as default command
	.command('$0', 'Default command is help', (yargs) => {
	}, function () {
		yargs.showHelp()
	})

	.help()
	.argv

import { v4 as uuid } from 'uuid'
import { consoleLogger } from '../tools/loggers'

class CountertopStation {
	logger = null

	id = null

	Appliance = null

	applianceSettings = null

	workers = []

	/**
	 * Create a CountertopStation
	 *
	 * @param  {Class}  Appliance         The IAppliance class that this station will manage.
	 * @param  {Object} applianceSettings Settings for the appliance.
	 * @param  {Logger} options.logger    A logger with methods for all TV Kitchen logLevels.
	 */
	constructor(
		Appliance,
		applianceSettings = {},
		{
			logger = consoleLogger,
		} = {},
	) {
		this.Appliance = Appliance
		this.applianceSettings = applianceSettings
		this.logger = logger
		this.id = `${Appliance.name}::${uuid()}`
	}

	/**
	 * Get the data types that this station processes.
	 *
	 * This is determined by the Appliance that the station hosts.
	 *
	 * @return {String[]} The data types that this station processes.
	 */
	getInputTypes = () => this.Appliance.getInputTypes()

	/**
	 * Get the data types that this station produces.
	 *
	 * This is determined by the Appliance that the station hosts.
	 *
	 * @return {String[]} The data types that this station produces.
	 */
	getOutputTypes = () => this.Appliance.getOutputTypes()
}

export default CountertopStation

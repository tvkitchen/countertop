import { v4 as uuid } from 'uuid'

class CountertopStation {
	id = null

	Appliance = null

	configuration = null

	workers = []

	/**
	 * Create a CountertopStation
	 *
	 * @param  {Class}  Appliance     The IAppliance class that this station will manage.
	 * @param  {Object} configuration The station and appliance configuration.
	 */
	constructor(
		Appliance,
		configuration = {},
	) {
		this.Appliance = Appliance
		this.configuration = configuration
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

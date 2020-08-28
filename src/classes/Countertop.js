import { consoleLogger } from '../tools/loggers'
import CountertopStation from './CountertopStation'
import CountertopTopology from './CountertopTopology'

/**
 * The Countertop sets up and monitors stations for registered appliances to ensure the proper
 * flow and processing of data.
 *
 * It is also responsible for emitting information and serving as the entry and exit point of
 * the countertop architecture.
 */
class Countertop {
	logger = null

	stations = []

	/**
	 * @param  {Logger} options.logger A logger with methods for all TV Kitchen logLevels.
	 */
	constructor({
		logger = consoleLogger,
	} = {}) {
		this.logger = logger
	}

	/**
	 * Register a new, configured appliance into the countertop.
	 * Appliances that ingest Payload streams may be cloned as new streams are created.
	 *
	 * @param  {Class}  Appliance         The class of the IAppliance being registered.
	 * @param  {Object} applianceSettings The settings to be passed to the appliance.
	 * @return {CountertopStation}        The station created for this appliance.
	 */
	addAppliance = (Appliance, applianceSettings = {}) => {
		const station = new CountertopStation(
			Appliance,
			applianceSettings,
			{
				logger: this.logger,
			},
		)
		this.stations.push(station)
		return station
	}

	updateTopology = () => {
		const topology = new CountertopTopology(this.stations)
		return topology
	}
}

export default Countertop

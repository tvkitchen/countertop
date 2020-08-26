import CountertopStation from '%src/classes/CountertopStation'
import CountertopTopology from '%src/classes/CountertopTopology'

/**
 * The Countertop sets up and monitors stations for registered appliances to ensure the proper
 * flow and processing of data.
 *
 * It is also responsible for emitting information and serving as the entry and exit point of
 * the countertop architecture.
 */
class Countertop {
	stations = []

	/**
	 * Register a new, configured appliance into the countertop.
	 * Appliances that ingest Payload streams may be cloned as new streams are created.
	 *
	 * @param  {Class}  Appliance     The class of the IAppliance being registered.
	 * @param  {String} configuration The configuration used to register the appliance station.
	 * @return {CountertopStation}    The station created for this appliance.
	 */
	addAppliance = (Appliance, configuration) => {
		const station = new CountertopStation(
			Appliance,
			configuration,
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

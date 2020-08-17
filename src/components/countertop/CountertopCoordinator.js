import CountertopStation from '%src/components/countertop/CountertopStation'
import CountertopTopology from '%src/components/countertop/CountertopTopology'

/**
 * The Countertop Coordinator (aka the Sous Chef) sets up and monitors all aspects of the
 * countertop to ensure the proper flow and processing of data.
 *
 * It is also the integration point between the Countertop and other system components.
 */
class CountertopCoordinator {
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

export default CountertopCoordinator

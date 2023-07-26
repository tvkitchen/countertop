import { Kafka } from 'kafkajs'
import { countertopStates } from '../constants'
import { silentLogger } from '../tools/loggers'
import { CountertopStation } from './CountertopStation'
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

	kafka = null

	stations = []

	state = ''

	/**
	 * @param  {Logger} options.logger        A logger with methods for all TV Kitchen logLevels.
	 * @param  {Object} options.kafkaSettings Kafka settings as defined in the KafkaJS library.
	 */
	constructor({
		logger = silentLogger,
		kafkaSettings = {},
	} = {}) {
		this.logger = logger
		this.setState(countertopStates.STOPPED)
		this.kafka = new Kafka({
			brokers: ['127.0.0.1:9092'],
			...kafkaSettings,
		})
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
		this.logger.trace('CountertopCoordinator: addAppliance()')
		if (this.getState() !== countertopStates.STOPPED) {
			throw new Error('The Countertop must be stopped in order to add an Appliance.')
		}

		const station = new CountertopStation(
			Appliance,
			applianceSettings,
			{
				logger: this.logger,
				kafka: this.kafka,
			},
		)
		this.stations.push(station)
		this.updateTopology()
		return station
	}

	/**
	 * Start the countertop and begin data processing.
	 *
	 * This will regenerate the countertop topology to reflect all currently added appliances.
	 *
	 * @return {Boolean} Whether the countertop successfully started.
	 */
	start = async () => {
		this.logger.trace('CountertopCoordinator: start()')
		this.setState(countertopStates.STARTING)
		const promises = this.stations.map((station) => station.start())
		const started = (await Promise.all(promises)).every((result) => result)
		this.setState(started ? countertopStates.STARTED : countertopStates.ERRORED)
		return this.getState() === countertopStates.STARTED
	}

	/**
	 * Stop the countertop and halt all data processing.
	 *
	 * @return {Boolean} Whether the countertop successfully stopped.
	 */
	stop = async () => {
		this.logger.trace('CountertopCoordinator: stop()')
		this.setState(countertopStates.STOPPING)
		this.stations.map((station) => station.stop())
		const promises = this.stations.map(async (station) => station.stop())
		const stopped = (await Promise.all(promises)).every((result) => result)
		this.setState(stopped ? countertopStates.STOPPED : countertopStates.ERRORED)
		return this.getState() === countertopStates.STOPPED
	}

	/**
	 * Generates a new topology based on the current list of stations and registers that topology
	 * with those stations.
	 *
	 * @return {CountertopTopology} The new countertop topology.
	 */
	updateTopology = () => {
		this.logger.trace('CountertopCoordinator: updateTopology()')
		if (this.state !== countertopStates.STOPPED) {
			throw new Error('The Countertop must be stopped in order to update topology.')
		}
		const topology = new CountertopTopology(this.stations)
		this.stations.map((station) => station.invokeTopology(topology))
		return topology
	}

	/**
	 * Get the current state of the Countertop.
	 *
	 * @return {String} The state of the Countertop.
	 */
	getState = () => this.state

	/**
	 * Set the current state of the Countertop.
	 *
	 * This is an internal method.
	 */
	setState = (state) => { this.state = state }

	/**
	 * Registers a listener to the Countertop for a given event type.
	 *
	 * Event types are defined in @tvkitchen/base-constants
	 *
	 * @param  {String} eventType  The type of event being listened to.
	 * @param  {Function} listener The listener to be registered for that event.
	 * @return {Countertop}        The countertop instance (to enable chaining).
	 */
	on = (eventType, listener) => {
		this.stations.forEach((station) => station.on(eventType, listener))
		return this
	}
}

export default Countertop

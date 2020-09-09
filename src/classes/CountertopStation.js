import { v4 as uuid } from 'uuid'
import { countertopStates } from '../constants'
import { consoleLogger } from '../tools/loggers'
import CountertopWorker from './CountertopWorker'

class CountertopStation {
	logger = null

	kafka = null

	id = null

	Appliance = null

	applianceSettings = null

	workers = []

	state = ''

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
			kafka,
		} = {},
	) {
		if (Appliance === undefined) {
			throw new Error('CountertopStation requires an Appliance.')
		}
		this.Appliance = Appliance
		this.applianceSettings = applianceSettings
		this.logger = logger
		this.kafka = kafka
		this.id = `${Appliance.name}::${uuid()}`
		this.setState(countertopStates.STOPPED)
	}

	/**
	 * Replace the station's workers in order to fit a specified topology.
	 *
	 * @param  {CountertopToplogy} topology The topology to use.
	 * @return {CountertopWorker[]}         The new set of workers.
	 */
	invokeTopology = (topology) => {
		this.logger.trace(`CountertopStation<${this.id}>: invokeTopology()`)
		if (this.getState() !== countertopStates.STOPPED) {
			throw new Error('CountertopStations must be stopped before invoking a topology.')
		}
		const stationStreams = topology.streams.filter((stream) => stream.getMouth() === this)
		this.workers = stationStreams.map((stream) => new CountertopWorker(
			this.Appliance,
			this.applianceSettings,
			{
				stream,
				logger: this.logger,
				kafka: this.kafka,
			},
		))
		return this.workers
	}

	/**
	 * Start the station and begin data processing.
	 *
	 * @return {Boolean} Whether the station successfully started.
	 */
	start = async () => {
		this.logger.trace(`CountertopStation<${this.id}>: start()`)
		this.state = countertopStates.STARTING
		const promises = this.workers.map(async (worker) => worker.start())
		const started = (await Promise.all(promises)).every((result) => result)
		this.setState(started ? countertopStates.STARTED : countertopStates.ERRORED)
		return this.getState() === countertopStates.STARTED
	}

	/**
	 * Stop the countertop and halt all data processing.
	 *
	 * @return {Boolean} Whether the station successfully stopped.
	 */
	stop = async () => {
		this.logger.trace(`CountertopStation<${this.id}>: stop()`)
		this.setState(countertopStates.STOPPING)
		const promises = this.workers.map(async (worker) => worker.stop())
		const stopped = (await Promise.all(promises)).every((result) => result)
		this.setState(stopped ? countertopStates.STOPPED : countertopStates.ERRORED)
		return this.getState() === countertopStates.STOPPED
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

	/**
	 * Get the current state of the CountertopWorker.
	 *
	 * @return {String} The state of the CountertopWorker.
	 */
	getState = () => this.state

	/**
	 * Set the current state of the Countertop.
	 *
	 * This is an internal method.
	 */
	setState = (state) => { this.state = state }
}

export default CountertopStation

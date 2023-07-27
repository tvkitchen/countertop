import { Kafka } from 'kafkajs'
import { CountertopState } from '../types'
import { CountertopStateError } from '../errors'
import { CountertopStation } from './CountertopStation'
import { CountertopTopology } from './CountertopTopology'
import type { KafkaConfig } from 'kafkajs'
import type { Logger } from '../types'
import type {
	ApplianceSettings,
	ImplementedApplianceClass,
} from './AbstractAppliance'

interface CountertopSettings {
	logger?: Logger;
	kafkaSettings?: KafkaConfig;
}

/**
 * The Countertop sets up and monitors stations for registered appliances to ensure the proper
 * flow and processing of data.
 *
 * It is also responsible for emitting information and serving as the entry and exit point of
 * the countertop architecture.
 */
export class Countertop {
	public readonly settings: CountertopSettings

	public stations: CountertopStation[] = []

	#state: CountertopState

	#topology: CountertopTopology

	#kafka: Kafka

	/**
	 * @param  {Logger} options.logger        A logger with methods for all TV Kitchen logLevels.
	 * @param  {Object} options.kafkaSettings Kafka settings as defined in the KafkaJS library.
	 */
	constructor(
		settings: CountertopSettings = {},
	) {
		this.settings = settings
		this.#state = CountertopState.Stopped
		this.#kafka = new Kafka({
			brokers: ['127.0.0.1:9092'],
			...this.settings.kafkaSettings,
		})
		this.stations = []
		this.#topology = new CountertopTopology()
	}

	/**
	 * Register a new, configured appliance into the countertop.
	 * Appliances that ingest Payload streams may be cloned as new streams are created.
	 *
	 * @param  {Class}  Appliance         The class of the IAppliance being registered.
	 * @param  {Object} applianceSettings The settings to be passed to the appliance.
	 * @return {CountertopStation}        The station created for this appliance.
	 */
	public addAppliance(
		ApplianceClass: ImplementedApplianceClass,
		applianceSettings?: ApplianceSettings,
	) {
		this.settings.logger?.debug('Countertop: addAppliance()')
		if (this.#state !== CountertopState.Stopped) {
			throw new CountertopStateError('The Countertop must be stopped in order to add an Appliance.')
		}

		const station = new CountertopStation(
			ApplianceClass,
			applianceSettings,
			{
				logger: this.settings.logger,
				kafka: this.#kafka,
			},
		)
		this.stations.push(station)
		this.updateTopology()
		return station
	}

	/**
	 * Start the Countertop and begin data processing against the current topology.
	 */
	public async start(): Promise<void> {
		this.settings.logger?.debug('Countertop: start()')
		this.#state = CountertopState.Starting
		try {
			await this.startAllStations()
		} catch (e: unknown) {
			this.#state = CountertopState.Errored
			await this.stopAllStations()
			throw e
		}
		this.#state = CountertopState.Started
	}

	/**
	 * Stop the Countertop and halt all data processing.
	 */
	public async stop() {
		this.settings.logger?.debug('Countertop: stop()')
		this.#state = CountertopState.Stopping
		try {
			await this.stopAllStations()
		} catch (e: unknown) {
			this.#state = CountertopState.Errored
			throw e
		}
		this.#state = CountertopState.Stopped
	}

	/**
	 * Get the current state of the Countertop.
	 */
	public get state() {
		return this.#state
	}

	public get topology() {
		return this.#topology
	}

	/**
	 * Registers a listener to the Countertop for a given event type.
	 */
	public on(
		eventType: string,
		listener: (...args: unknown[]) => void,
	): this {
		this.stations.forEach(
			(station) => station.on(eventType, listener),
		)
		return this
	}

	private async startAllStations(): Promise<void> {
		await Promise.all(
			this.stations.map(
				(station) => station.start(),
			),
		)
	}

	private async stopAllStations(): Promise<void> {
		await Promise.all(
			this.stations.map(
				(station) => station.stop(),
			),
		)
	}

	private updateTopology(): void {
		this.settings.logger?.debug('Countertop: updateTopology()')
		if (this.#state !== CountertopState.Stopped) {
			throw new CountertopStateError('The Countertop must be stopped in order to update topology.')
		}
		this.#topology = new CountertopTopology(this.stations)
		this.stations.map(
			(station) => station.invokeTopology(this.#topology),
		)
	}
}

import { v4 as uuid } from 'uuid'
import { Kafka } from 'kafkajs'
import { CountertopStationState } from '../types'
import { CountertopStationStateError } from '../errors'
import { CountertopWorker } from './CountertopWorker'
import type { Logger } from '../types'
import type {
	ImplementedApplianceClass,
	ApplianceSettings,
} from './AbstractAppliance'
import type { CountertopTopology } from './CountertopTopology'

interface CountertopStationSettings {
	logger?: Logger;
	kafka: Kafka;
}

export class CountertopStation {
	public readonly settings: CountertopStationSettings

	public readonly id: string

	public readonly ApplianceClass: ImplementedApplianceClass

	public readonly applianceSettings?: ApplianceSettings

	#workers: CountertopWorker[]

	#state: CountertopStationState

	constructor(
		ApplianceClass: ImplementedApplianceClass,
		applianceSettings?: ApplianceSettings,
		settings: CountertopStationSettings = {
			kafka: new Kafka({ brokers: [] }),
		},
	) {
		this.ApplianceClass = ApplianceClass
		this.applianceSettings = applianceSettings
		this.settings = settings
		this.id = `${ApplianceClass.name}::${uuid()}`
		this.#state = CountertopStationState.Stopped
		this.#workers = []
	}

	/**
	 * Replace the station's workers in order to fit a specified topology.
	 *
	 * @param  {CountertopToplogy} topology The topology to use.
	 * @return {CountertopWorker[]}         The new set of workers.
	 */
	public invokeTopology(
		topology: CountertopTopology,
	): CountertopWorker[] {
		this.settings.logger?.debug(`CountertopStation<${this.id}>: invokeTopology()`)
		if (this.state !== CountertopStationState.Stopped) {
			throw new CountertopStationStateError('CountertopStations must be stopped when invoking a topology.')
		}

		const stationStreams = topology.streams.filter(
			(stream) => stream.mouth === this,
		)
		this.#workers = stationStreams.map((stream) => (
			new CountertopWorker(
				this.ApplianceClass,
				this.applianceSettings,
				{
					stream,
					logger: this.settings.logger,
					kafka: this.settings.kafka,
				},
			)
		))
		return this.#workers
	}

	/**
	 * Start the CountertopStation and begin data processing.
	 */
	public async start(): Promise<void> {
		this.settings.logger?.debug(`CountertopStation<${this.id}>: start()`)
		this.#state = CountertopStationState.Starting
		try {
			await this.startAllWorkers()
		} catch (e: unknown) {
			this.#state = CountertopStationState.Errored
			await this.stopAllWorkers()
			throw e
		}
		this.#state = CountertopStationState.Started
	}

	/**
	 * Stop the CountertopStation and halt all data processing.
	 */
	public async stop(): Promise<void> {
		this.settings.logger?.debug(`CountertopStation<${this.id}>: stop()`)
		this.#state = CountertopStationState.Stopping
		await this.stopAllWorkers()
	}

	/**
	 * Get the data types that this station processes.
	 *
	 * This is determined by the Appliance that the station hosts.
	 */
	public getInputTypes() {
		return this.ApplianceClass.getInputTypes(this.applianceSettings)
	}

	/**
	 * Get the data types that this station produces.
	 *
	 * This is determined by the Appliance that the station hosts.
	 */
	public getOutputTypes() {
		return this.ApplianceClass.getOutputTypes(this.applianceSettings)
	}

	public get state() {
		return this.#state
	}

	/**
	 * Registers a listener to the CountertopStation for a given event type.
	 *
	 * Event types are defined in @tvkitchen/base-constants
	 */
	public on(
		eventType: string,
		listener: (...args: unknown[]) => void,
	): this {
		this.#workers.forEach(
			(worker) => worker.on(eventType, listener),
		)
		return this
	}

	private async startAllWorkers(): Promise<void> {
		await Promise.all(
			this.#workers.map(
				async (worker) => worker.start(),
			),
		)
	}

	private async stopAllWorkers(): Promise<void> {
		await Promise.all(
			this.#workers.map(
				async (worker) => worker.stop(),
			),
		)
	}
}

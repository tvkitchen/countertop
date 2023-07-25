import { Writable } from 'stream'
import { v4 as uuid } from 'uuid'
import { getStreamTopic } from '../tools/utils/countertop'
import { UnhealthyApplianceError } from '../errors'
import { Payload } from './Payload'
import type {
	Admin,
	Consumer,
	Kafka,
	Producer,
} from 'kafkajs'
import type {
	AbstractAppliance,
	ImplementedApplianceClass,
	ApplianceSettings,
} from './AbstractAppliance'
import type { CountertopStream } from './CountertopStream'
import type { Logger } from '../types'

interface CountertopWorkerSettings {
	stream: CountertopStream;
	logger?: Logger;
	kafka: Kafka;
}

/**
 * A CountertopWorker is responsible for monitoring specific data streams
 * and processing those streams using TV Kitchen Appliances to create new data.
 *
 * CountertopWorker instances consume Payloads and pass them to their Appliances.
 * CountertopWorker instances listen for emitted Payloads from Appliances and process them.
 */
export class CountertopWorker {
	public readonly id: string

	readonly #consumer: Consumer

	readonly #producer: Producer

	readonly #admin: Admin

	readonly #appliance: AbstractAppliance

	readonly ApplianceClass: ImplementedApplianceClass

	readonly applianceSettings?: ApplianceSettings

	readonly settings: CountertopWorkerSettings

	/**
	 * Create a new CountertopWorker.
	 *
	 * @param  {Class}            ApplianceClass    The appliance class this worker will use.
	 * @param  {Object}           applianceSettings The settings to be passed to the appliance.
	 * @param  {CountertopStream} countertopWorkerSettings The settings specific to this worker.
	 */
	constructor(
		ApplianceClass: ImplementedApplianceClass,
		applianceSettings: ApplianceSettings | undefined,
		countertopWorkerSettings: CountertopWorkerSettings,
	) {
		this.id = `CountertopWorker::${ApplianceClass.name}::${uuid()}`
		this.ApplianceClass = ApplianceClass
		this.applianceSettings = applianceSettings
		this.settings = countertopWorkerSettings
		this.#consumer = this.settings.kafka.consumer({ groupId: this.id })
		this.#producer = this.settings.kafka.producer()
		this.#admin = this.settings.kafka.admin()
		this.#appliance = new ApplianceClass(applianceSettings)
		const kafkaWriteStream = new Writable({
			objectMode: true,
			write: (payload: Payload, enc, done) => {
				this.#producer.send({
					topic: getStreamTopic(payload.type, this.settings.stream),
					messages: [{
						value: Payload.byteSerialize(payload),
					}],
				})
					.then(() => done())
					.catch((error: unknown) => {
						if (error instanceof Error) {
							done(error)
						} else {
							done(new Error('Something went wrong when writing to the kafka stream'))
						}
					})
			},
		})
		this.#appliance.pipe(kafkaWriteStream)
	}

	/**
	 * Start the worker and begin data processing.
	 */
	public async start(): Promise<void> {
		this.settings.logger?.debug(`CountertopWorker<${this.id}>: start()`)
		if (!await this.#appliance.healthCheck()) {
			throw new UnhealthyApplianceError('The Appliance associated with this worker failed a health check.')
		}
		await this.#admin.connect()
		await this.#producer.connect()
		await this.#consumer.connect()
		const inputTopics = this.ApplianceClass.getInputTypes(
			this.#appliance.settings,
		).map(
			(inputType) => {
				const inputStream = this.settings.stream.tributaries.get(inputType)
				if (inputStream === undefined) {
					return null
				}
				return getStreamTopic(
					inputType,
					inputStream,
				)
			},
		).filter(
			(topic: string | null): topic is string => topic !== null,
		)
		const outputTopics = this.ApplianceClass.getOutputTypes(
			this.applianceSettings,
		).map(
			(outputType) => getStreamTopic(
				outputType,
				this.settings.stream,
			),
		)
		const outputTopicConfigs = outputTopics.map(
			(topic) => ({
				topic,
				configEntries: [
					{ name: 'retention.ms', value: '30000' },
				],
			}),
		)
		await this.#admin.createTopics({
			waitForLeaders: true,
			topics: outputTopicConfigs,
		})
		await Promise.all(
			inputTopics.map((topic) => this.#consumer.subscribe({ topic })),
		)
		if (!await this.#appliance.start()) {
			throw new UnhealthyApplianceError('The Appliance associated with this worker failed to start.')
		}
		await this.#consumer.run({
			eachMessage: async ({ message }) => {
				// TODO: stream has no type definition yet; once it does, we need to update this.
				// eslint-disable-next-line
				this.settings.logger?.debug(`CountertopWorker<${this.settings.stream.id}>.consumer: eachMessage()`)
				if (message.value == null) {
					return
				}
				const payload = Payload.byteDeserialize(message.value)
				await new Promise((resolve, reject) => {
					try {
						this.#appliance.write(payload, resolve)
					} catch (err) {
						reject(err)
					}
				})
			},
		})
	}

	/**
	 * Stop the worker and halt all data processing.
	 */
	stop = async (): Promise<void> => {
		this.settings.logger?.debug(`CountertopWorker<${this.id}>: stop()`)
		await this.#appliance.stop()
		await this.#consumer.disconnect()
		await this.#producer.disconnect()
		await this.#admin.disconnect()
	}

	/**
	 * Registers a listener to the CountertopWorker for a given event type.
	 *
	 * Event types are defined in @tvkitchen/base-constants
	 *
	 * @param  {string} eventType  The type of event being listened to.
	 * @param  {Function} listener The listener to be registered for that event.
	 * @return {CountertopWorker}  The CountertopWorker instance (to enable chaining).
	 */
	public on(
		eventType: string,
		listener: (...args: unknown[]) => void,
	): this {
		this.#appliance.on(eventType, listener)
		return this
	}
}

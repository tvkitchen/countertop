import { Writable } from 'stream'
import { v4 as uuid } from 'uuid'
import { IAppliance } from '@tvkitchen/base-interfaces'
import { AvroPayload } from '@tvkitchen/base-classes'
import { consoleLogger } from '../tools/loggers'
import { getStreamTopic } from '../tools/utils/countertop'

/**
 * A CountertopWorker (aka Line Cook) is responsible for monitoring specific data streams
 * and processing those streams using TV Kitchen Appliances to create new data.
 *
 * CountertopWorker instances consume Payloads from Kafka and pass them to their Appliances.
 * CountertopWorker instances listen for emitted Payloads from appliances and process them.
 */
class CountertopWorker {
	logger = null

	id = null

	kafka = null

	consumer = null

	producer = null

	admin = null

	appliance = null

	stream = null

	/**
	 * Create a new CountertopWorker.
	 *
	 * @param  {Class}            Appliance         The appliance class this worker will use.
	 * @param  {Object}           applianceSettings The settings to be passed to the appliance.
	 * @param  {CountertopStream} options.stream    The stream this worker is tracking.
	 * @param  {Logger}           options.logger    The logger the worker should use.
	 * @param  {KafkaJS}          options.kafka     The kafkajs object the worker will use.
	 */
	constructor(
		Appliance,
		applianceSettings = {},
		{
			stream,
			logger = consoleLogger,
			kafka,
		} = {},
	) {
		this.id = `CountertopWorker::${Appliance.name}::${uuid()}`
		this.stream = stream
		this.logger = logger
		this.kafka = kafka
		this.consumer = this.kafka.consumer({ groupId: this.id })
		this.producer = this.kafka.producer()
		this.admin = this.kafka.admin()
		this.appliance = new Appliance({
			logger,
			...applianceSettings,
		})
		if (!IAppliance.isIAppliance(this.appliance)) {
			throw new Error('TVKitchen can only use Appliances that extend IAppliance.')
		}
		const kafkaWriteStream = new Writable({
			objectMode: true,
			write: async (payload, enc, done) => {
				await this.producer.send({
					topic: getStreamTopic(payload.type, this.stream),
					messages: [{
						value: AvroPayload.serialize(payload),
					}],
				})
				done()
			},
		})
		this.appliance.pipe(kafkaWriteStream)
	}

	/**
	 * Start the worker and begin data processing.
	 *
	 * @return {Boolean} Whether the worker successfully started.
	 */
	start = async () => {
		this.logger.trace(`CountertopWorker<${this.id}>: start()`)
		if (!await this.appliance.audit()) {
			return false
		}
		await this.admin.connect()
		await this.producer.connect()
		await this.consumer.connect()
		const inputTopics = this.appliance.constructor.getInputTypes(
			this.appliance.settings,
		).map(
			(inputType) => {
				const inputStream = this.stream.getTributaryMap().get(inputType)
				if (inputStream) {
					return getStreamTopic(
						inputType,
						inputStream,
					)
				}
				return null
			},
		).filter(
			(topic) => topic !== null,
		)
		const outputTopics = this.appliance.constructor.getOutputTypes(
			this.appliance.settings,
		).map(
			(outputType) => getStreamTopic(
				outputType,
				this.stream,
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
		await this.admin.createTopics({
			waitForLeaders: true,
			topics: outputTopicConfigs,
		})
		await Promise.all(
			inputTopics.map((topic) => this.consumer.subscribe({ topic })),
		)
		if (!this.appliance.start()) {
			return false
		}
		await this.consumer.run({
			eachMessage: async ({ message }) => {
				this.logger.trace(`CountertopWorker<${this.stream.id}>.consumer: eachMessage()`)
				const payload = AvroPayload.deserialize(message.value)
				return new Promise((resolve, reject) => {
					try {
						this.appliance.write(payload, resolve)
					} catch (err) {
						reject(err)
					}
				})
			},
		})
		return true
	}

	/**
	 * Stop the worker and halt all data processing.
	 *
	 * @return {Boolean} Whether the worker successfully stopped.
	 */
	stop = async () => {
		this.logger.trace(`CountertopWorker<${this.id}>: stop()`)
		await this.appliance.stop()
		await this.consumer.disconnect()
		await this.producer.disconnect()
		await this.admin.disconnect()
		return true
	}

	/**
	 * Registers a listener to the CountertopWorker for a given event type.
	 *
	 * Event types are defined in @tvkitchen/base-constants
	 *
	 * @param  {String} eventType  The type of event being listened to.
	 * @param  {Function} listener The listener to be registered for that event.
	 * @return {CountertopWorker}  The CountertopWorker instance (to enable chaining).
	 */
	on = (eventType, listener) => {
		this.appliance.on(eventType, listener)
		return this
	}
}

export default CountertopWorker

import { v4 as uuid } from 'uuid'
import { IAppliance } from '@tvkitchen/base-interfaces'
import { Payload } from '@tvkitchen/base-classes'
import { applianceEvents } from '@tvkitchen/base-constants'
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
		this.appliance = new Appliance(applianceSettings)
		if (!IAppliance.isIAppliance(this.appliance)) {
			throw new Error('TVKitchen can only use Appliances that extend IAppliance.')
		}

		this.appliance.on(
			applianceEvents.PAYLOAD,
			(payload) => this.producer.send({
				topic: getStreamTopic(payload.type, this.stream),
				messages: [{
					value: Payload.serialize(payload),
				}],
			}),
		)
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
		const inputTopics = this.appliance.constructor.getInputTypes().map(
			(inputType) => getStreamTopic(
				inputType,
				this.stream.getTributaryMap().get(inputType),
			),
		)
		const outputTopics = this.appliance.constructor.getOutputTypes().map(
			(outputType) => getStreamTopic(
				outputType,
				this.stream,
			),
		)
		const outputTopicConfigs = outputTopics.map(
			(topic) => ({ topic }),
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
				this.logger.debug(`CountertopWorker<${this.stream.id}>.consumer: eachMessage()`)
				const payload = Payload.deserialize(message.value)
				await this.appliance.ingestPayload(payload)
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
}

export default CountertopWorker

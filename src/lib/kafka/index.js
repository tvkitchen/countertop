import { Kafka } from 'kafkajs'
import config from '%src/config'

const kafka = new Kafka({
	clientId: 'tv-kitchen',
	brokers: [config.KAFKA_BROKERS],
})

export default kafka

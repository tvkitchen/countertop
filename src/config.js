import dotenv from 'dotenv'

dotenv.config()
export default {
	KAFKA_BROKERS: process.env.KAFKA_BROKERS.split(','),
	...process.env,
}

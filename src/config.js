import dotenv from 'dotenv'

import { expandRangeOfIntegers } from '%src/lib/utils'

dotenv.config()

export default {
	...process.env,
	KAFKA_BROKERS: process.env.KAFKA_BROKERS.split(','),
	INTERNAL_STREAM_PORT_RANGE: expandRangeOfIntegers(process.env.INTERNAL_STREAM_PORT_RANGE),
}

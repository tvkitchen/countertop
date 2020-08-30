/* eslint-disable no-console */
// Since using `console` here is kind of the whole point.
import { logLevels } from '@tvkitchen/base-constants'

const log = (level, message) => {
	const structuredMessage = JSON.stringify({
		level,
		message,
	})
	switch (level) {
		case logLevels.fatal:
		case logLevels.error:
			return console.error(structuredMessage)
		case logLevels.warn:
			return console.warn(structuredMessage)
		case logLevels.info:
			return console.info(structuredMessage)
		case logLevels.debug:
			return console.debug(structuredMessage)
		case logLevels.trace:
			return console.trace(structuredMessage)
		default:
			return console.log(structuredMessage)
	}
}

export default {
	log,
	fatal: log.bind(this, logLevels.fatal),
	error: log.bind(this, logLevels.error),
	warn: log.bind(this, logLevels.warn),
	info: log.bind(this, logLevels.info),
	debug: log.bind(this, logLevels.debug),
	trace: log.bind(this, logLevels.trace),
}

import { logLevels } from '@tvkitchen/base-constants'

export default {
	log: (level, message) => console.log(`${level}: ${message}`), // eslint-disable-line no-console
	fatal: (message) => this.logger.log(logLevels.fatal, message),
	error: (message) => this.logger.log(logLevels.error, message),
	warn: (message) => this.logger.log(logLevels.warn, message),
	info: (message) => this.logger.log(logLevels.info, message),
	debug: (message) => this.logger.log(logLevels.debug, message),
	trace: (message) => this.logger.log(logLevels.trace, message),
}

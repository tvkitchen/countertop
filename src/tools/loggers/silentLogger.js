import { logLevels } from '@tvkitchen/base-constants'

const log = () => {}

export default {
	log,
	fatal: log.bind(this, logLevels.fatal),
	error: log.bind(this, logLevels.error),
	warn: log.bind(this, logLevels.warn),
	info: log.bind(this, logLevels.info),
	debug: log.bind(this, logLevels.debug),
	trace: log.bind(this, logLevels.trace),
}

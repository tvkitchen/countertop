import {
	createLogger,
	format,
	transports,
} from 'winston'

import config from '../../config'

const logger = createLogger({
	level: config.LOG_LEVEL || 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.errors({
			stack: true,
		}),
		format.splat(),
		format.json(),
	),
	defaultMeta: { service: 'tv-kitchen' },
	transports: [
		new transports.Console({
			format: format.combine(
				format.timestamp({
					format: 'HH:mm:ss',
				}),
				format.colorize(),
				format.timestamp(),
				format.align(),
				format.printf((info) => `${info.timestamp} (${info.level}): ${info.message} ${info.stack || ''}`),
			),
		}),
	],
})

export default logger

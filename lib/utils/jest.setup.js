import { NullConsole } from '@jest/console'
import { transports } from 'winston'
import logger from '%src/tools/logger'

const getConsoleTransport = () => logger.transports.find(
	(transport) => transport.constructor.name === transports.Console.name,
)
// eslint-disable-next-line no-console
const isJestSilent = () => console.constructor.name === NullConsole.name

// Respect Jest's silent configuration by silencing Winston's logging.
// Can be overridden by specifying --no-silent on the command line.

const consoleTransport = getConsoleTransport()

if (consoleTransport) {
	consoleTransport.silent = isJestSilent()
}

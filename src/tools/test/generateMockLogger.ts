import { BaseMockLogger } from './BaseMockLogger'
import type { Logger } from '../../types'
import type { FunctionSignature } from './FunctionSignature'

interface MockableLoggerAttributes {
	error?: FunctionSignature<Logger['error']>;
	warn?: FunctionSignature<Logger['warn']>;
	info?: FunctionSignature<Logger['info']>;
	debug?: FunctionSignature<Logger['debug']>;
}

/**
 * Creates a mocked logger implementation
 */
export const generateMockLogger = (
	attributes: MockableLoggerAttributes = {},
): Logger => {
	const logger = new BaseMockLogger()
	logger.error = (attributes.error ?? logger.error).bind(logger)
	logger.warn = (attributes.warn ?? logger.warn).bind(logger)
	logger.info = (attributes.info ?? logger.info).bind(logger)
	logger.debug = (attributes.debug ?? logger.debug).bind(logger)
	return logger
}

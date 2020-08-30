import consoleLogger from '../consoleLogger'

describe('consoleLogger #unit', () => {
	describe('default', () => {
		it('should support the log() method', () => {
			expect(() => consoleLogger.log('customLevel', 'Test message')).not.toThrow()
		})
		it('should support the fatal() method', () => {
			expect(() => consoleLogger.fatal('Test message')).not.toThrow()
		})
		it('should support the error() method', () => {
			expect(() => consoleLogger.error('Test message')).not.toThrow()
		})
		it('should support the warn() method', () => {
			expect(() => consoleLogger.warn('Test message')).not.toThrow()
		})
		it('should support the info() method', () => {
			expect(() => consoleLogger.info('Test message')).not.toThrow()
		})
		it('should support the debug() method', () => {
			expect(() => consoleLogger.debug('Test message')).not.toThrow()
		})
		it('should support the trace() method', () => {
			expect(() => consoleLogger.trace('Test message')).not.toThrow()
		})
	})
})

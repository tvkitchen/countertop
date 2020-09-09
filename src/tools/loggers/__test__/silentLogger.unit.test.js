import silentLogger from '../silentLogger'

describe('silentLogger #unit', () => {
	describe('default', () => {
		it('should support the log() method', () => {
			expect(() => silentLogger.log('customLevel', 'Test message')).not.toThrow()
		})
		it('should support the fatal() method', () => {
			expect(() => silentLogger.fatal('Test message')).not.toThrow()
		})
		it('should support the error() method', () => {
			expect(() => silentLogger.error('Test message')).not.toThrow()
		})
		it('should support the warn() method', () => {
			expect(() => silentLogger.warn('Test message')).not.toThrow()
		})
		it('should support the info() method', () => {
			expect(() => silentLogger.info('Test message')).not.toThrow()
		})
		it('should support the debug() method', () => {
			expect(() => silentLogger.debug('Test message')).not.toThrow()
		})
		it('should support the trace() method', () => {
			expect(() => silentLogger.trace('Test message')).not.toThrow()
		})
	})
})

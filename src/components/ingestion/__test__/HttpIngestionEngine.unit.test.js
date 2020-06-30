import HttpIngestionEngine from '../HttpIngestionEngine'

describe('HttpIngestionEngine', () => {
	describe('constructor', () => {
		it('should throw an error when called without a path', () => {
			expect(() => {
				new HttpIngestionEngine() // eslint-disable-line no-new
			}).toThrow(Error)
		})
	})
})

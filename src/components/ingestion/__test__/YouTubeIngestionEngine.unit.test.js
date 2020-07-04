// import nock from 'nock'
import YouTubeIngestionEngine from '../YouTubeIngestionEngine'

describe('YouTubeIngestionEngine', () => {
	describe('constructor', () => {
		it('should throw an error when called without a URL', () => {
			expect(() => {
				new YouTubeIngestionEngine() // eslint-disable-line no-new
			}).toThrow(Error)
		})
	})

	// TODO: tests
})

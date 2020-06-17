import path from 'path'
import { ReadStream } from 'fs'
import FileIngestionEngine from '../FileIngestionEngine'

describe('FileIngestionEngine', () => {
	describe('constructor', () => {
		it('should throw an error when called without a path', () => {
			expect(() => {
				new FileIngestionEngine() // eslint-disable-line no-new
			}).toThrow(Error)
		})
	})

	describe('getInputStream', () => {
		it('it should return a file read stream', () => {
			const fileEngine = new FileIngestionEngine(path.join(__dirname, '/data/empty.txt'))

			const inputStream = fileEngine.getInputStream()

			expect(inputStream).toBeInstanceOf(ReadStream)
		})
	})
})

import fs from 'fs'
import path from 'path'
import {
	AbstractInstantiationError,
} from '@tvkitchen/base-errors'
import { dataTypes } from '@tvkitchen/base-constants'
import AbstractIngestionEngine from '../AbstractIngestionEngine'
import FullyImplementedIngestionEngine from './classes/FullyImplementedIngestionEngine'
import PartiallyImplementedIngestionEngine from './classes/PartiallyImplementedIngestionEngine'

// Set up mocks
import kafka from '%src/lib/kafka'

jest.mock('%src/lib/kafka')

describe('AbstractIngestionEngine', () => {
	describe('constructor', () => {
		it('should throw an error when called directly', () => {
			expect(() => {
				new AbstractIngestionEngine() // eslint-disable-line no-new
			}).toThrow(AbstractInstantiationError)
		})

		it('should allow construction when extended', () => {
			expect(() => {
				new PartiallyImplementedIngestionEngine() // eslint-disable-line no-new
			}).not.toThrow(Error)
		})

		it('should create a kafka producer when extended', () => {
			jest.clearAllMocks()
			new PartiallyImplementedIngestionEngine() // eslint-disable-line no-new
			expect(kafka.producer).toHaveBeenCalledTimes(1)
		})
	})

	describe('ingestData', () => {
		it('should send data to the kafka producer', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.producer = {
				send: jest.fn(),
			}
			const buffer = fs.readFileSync(path.join(__dirname, '/data/thinkingface.png'))
			ingestionEngine.ingestData(buffer)

			expect(ingestionEngine.producer.send).toHaveBeenCalledTimes(1)
		})

		it('should send data to the correct topic', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.producer = {
				send: jest.fn(),
			}
			const buffer = fs.readFileSync(path.join(__dirname, '/data/thinkingface.png'))
			ingestionEngine.ingestData(buffer)
			const generatedPayload = ingestionEngine.producer.send.mock.calls[0][0]

			expect(generatedPayload).toHaveProperty('topic')
			expect(generatedPayload.topic).toEqual(dataTypes.STREAM.DATA)
		})
	})

	describe('recordStream', () => {
	})

	describe('start', () => {
	})

	describe('getFfmpegSettings', () => {
	})

	describe('getInputLocation', () => {
	})

	describe('getInputStream', () => {
	})
})

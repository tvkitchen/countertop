// Mocked imports
import childProcess from 'child_process'
import stream from 'stream'
import kafka from '%src/tools/kafka' // eslint-disable-line import/order

// Test imports
import fs from 'fs'
import path from 'path'
import {
	AbstractInstantiationError,
	NotImplementedError,
} from '@tvkitchen/base-errors'
import { dataTypes } from '@tvkitchen/base-constants'
import { Payload } from '@tvkitchen/base-classes'
import { loadTestData } from '%src/tools/utils/jest'
import AbstractIngestionEngine from '../AbstractIngestionEngine'
import FullyImplementedIngestionEngine from './classes/FullyImplementedIngestionEngine'
import PartiallyImplementedIngestionEngine from './classes/PartiallyImplementedIngestionEngine'

// Set up mocks
jest.mock('child_process')
jest.mock('stream')
jest.mock('%src/tools/kafka')

// This pulls actual versions of mocked components, since we use them
const {
	Readable,
	Writable,
} = jest.requireActual('stream')

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

	describe('ingestPayload', () => {
		it('should require a Payload as input', async () => {
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.producer = { send: jest.fn() }
			ingestionEngine.ingestPayload('not a payload', null, (result) => {
				expect(result).toBeInstanceOf(Error)
			})
		})

		it('should send data to the kafka producer', async () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.producer = { send: jest.fn().mockResolvedValue() }
			const buffer = fs.readFileSync(path.join(__dirname, '/data/thinkingface.png'))
			const payload = new Payload({ data: buffer })
			ingestionEngine.ingestPayload(payload, null, () => {
				expect(ingestionEngine.producer.send).toHaveBeenCalledTimes(1)
			})
		})

		it('should send payloads to the correct topic', async () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.producer = { send: jest.fn().mockResolvedValue() }
			const buffer = fs.readFileSync(path.join(__dirname, '/data/thinkingface.png'))
			const payload = new Payload({ data: buffer })
			ingestionEngine.ingestPayload(payload, null, () => {
				const objectSentToKafka = ingestionEngine.producer.send.mock.calls[0][0]
				expect(objectSentToKafka).toHaveProperty('topic')
				expect(objectSentToKafka.topic).toEqual(dataTypes.STREAM.CONTAINER)
			})
		})

		it('should send a deserializable Payload', async () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.producer = { send: jest.fn().mockResolvedValue() }
			const buffer = fs.readFileSync(path.join(__dirname, '/data/thinkingface.png'))
			const payload = new Payload({ data: buffer })
			ingestionEngine.ingestPayload(payload, null, () => {
				const objectSentToKafka = ingestionEngine.producer.send.mock.calls[0][0]
				expect(objectSentToKafka.messages).toHaveLength(1)
				const messageValue = objectSentToKafka.messages[0].value
				expect(Payload.deserialize(messageValue)).toEqual(payload)
			})
		})
	})

	describe('processMpegtsStreamData', () => {
		it('should pass the data to the mpegts demuxer', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.mpegtsDemuxer = {
				process: jest.fn(),
			}
			ingestionEngine.getMostRecentDemuxedPacket = jest.fn().mockReturnValueOnce({ pts: 0 })
			const streamData = Buffer.from('testDataXYZ', 'utf8')
			ingestionEngine.processMpegtsStreamData(streamData, null, () => {
				expect(ingestionEngine.mpegtsDemuxer.process).toHaveBeenCalledTimes(1)
			})
		})
		it('should emit a Payload of type STREAM.CONTAINER', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.mpegtsDemuxer = { process: jest.fn }
			ingestionEngine.getMostRecentDemuxedPacket = jest.fn().mockReturnValueOnce({ pts: 0 })
			const streamData = Buffer.from('testDataXYZ', 'utf8')
			ingestionEngine.processMpegtsStreamData(streamData, null, (err, result) => {
				expect(result).toBeInstanceOf(Payload)
				expect(result.type).toEqual(dataTypes.STREAM.CONTAINER)
			})
		})
		it('should emit a Payload that contains the MPEG-TS data', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.mpegtsDemuxer = { process: jest.fn }
			ingestionEngine.getMostRecentDemuxedPacket = jest.fn().mockReturnValueOnce({ pts: 0 })
			const streamData = Buffer.from('testDataXYZ', 'utf8')
			ingestionEngine.processMpegtsStreamData(streamData, null, (err, result) => {
				expect(result).toBeInstanceOf(Payload)
				expect(result.data).toEqual(streamData)
			})
		})
		it('should correctly decorate the Payload with time', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.mpegtsDemuxer = {
				process: jest.fn(),
			}
			ingestionEngine.getMostRecentDemuxedPacket = jest.fn().mockReturnValueOnce({
				pts: 90000,
			})
			const streamData = Buffer.from('testDataXYZ', 'utf8')
			ingestionEngine.processMpegtsStreamData(streamData, null, (err, result) => {
				expect(result.position).toEqual(1000)
				expect(typeof result.createdAt).toBe('string')
			})
		})
	})

	describe('onDemuxedPacket', () => {
		it('should register new packets as most recent', () => {
			const testData = loadTestData(__dirname, 'onDemuxedPacket.json')
			const demuxedPacket = testData[0]
			const demuxedPacket2 = testData[1]
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.onDemuxedPacket(demuxedPacket)
			ingestionEngine.onDemuxedPacket(demuxedPacket2)
			expect(ingestionEngine.mostRecentDemuxedPacket).toEqual(demuxedPacket2)
		})
	})

	describe('getMostRecentDemuxedPacket', () => {
		it('should return the value in most recent demuxed packet', () => {
			const testData = loadTestData(__dirname, 'getMostRecentDemuxedPacket.json')
			const demuxedPacket = testData[0]
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.mostRecentDemuxedPacket = demuxedPacket
			expect(ingestionEngine.getMostRecentDemuxedPacket()).toEqual(demuxedPacket)
		})
		it('should return null if nothing has been processed', () => {
			const ingestionEngine = new FullyImplementedIngestionEngine()
			expect(ingestionEngine.getMostRecentDemuxedPacket()).toBe(null)
		})
	})

	describe('start', () => {
		it('should spawn an ffmpeg process', () => {
			jest.clearAllMocks()
			childProcess.spawn.mockReturnValueOnce({
				stdout: new Readable(),
				stdin: new Writable(),
			})
			const inputStream = new Readable({ read: () => {} })
			const ingestionEngine = new FullyImplementedIngestionEngine(inputStream)
			ingestionEngine.producer = { connect: jest.fn().mockResolvedValue() }
			ingestionEngine.start()
			expect(childProcess.spawn).toHaveBeenCalledTimes(1)
		})
		it('should create a processing pipeline', async () => {
			jest.clearAllMocks()
			childProcess.spawn.mockReturnValueOnce({
				stdout: new Readable(),
				stdin: new Writable(),
			})
			childProcess.spawn.mockReturnValueOnce({})
			const inputStream = new Readable({ read: jest.fn() })
			const ingestionEngine = new FullyImplementedIngestionEngine(inputStream)
			ingestionEngine.producer = { connect: jest.fn().mockResolvedValue() }
			await ingestionEngine.start()
			expect(stream.pipeline).toHaveBeenCalledTimes(1)
		})
	})

	describe('stop', () => {
		it('should kill the ffmpeg process and stop the stream', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.activeInputStream = {
				destroy: jest.fn(),
			}
			ingestionEngine.ffmpegProcess = {
				kill: jest.fn(),
			}
			ingestionEngine.producer = {
				disconnect: jest.fn(),
			}
			ingestionEngine.stop()
			expect(ingestionEngine.activeInputStream.destroy).toHaveBeenCalledTimes(1)
			expect(ingestionEngine.ffmpegProcess.kill).toHaveBeenCalledTimes(1)
		})
		it('should not error if called before starting', () => {
			jest.clearAllMocks()
			const ingestionEngine = new FullyImplementedIngestionEngine()
			ingestionEngine.producer = {
				disconnect: jest.fn(),
			}
			expect(() => ingestionEngine.stop()).not.toThrow()
		})
	})

	describe('getFfmpegSettings', () => {
		it('should return an array', () => {
			const ingestionEngine = new FullyImplementedIngestionEngine()
			expect(ingestionEngine.getFfmpegSettings()).toBeInstanceOf(Array)
		})
	})

	describe('getInputStream', () => {
		it('should throw an error when called without an implementation', () => {
			const ingestionEngine = new PartiallyImplementedIngestionEngine()
			expect(ingestionEngine.getInputStream).toThrow(NotImplementedError)
		})
	})
})

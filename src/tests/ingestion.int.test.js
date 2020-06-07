// Mocked import
import childProcess from 'child_process' // eslint-disable-line import/order

// Test imports
import fs from 'fs'
import path from 'path'
import { PassThrough } from 'stream'
import FileIngestionEngine from '%src/components/ingestion/FileIngestionEngine'

jest.mock('child_process')

describe('ingestion', () => {
	describe('FileIngestionEngine', () => {
		it('it should read a video file into a Kafka topic', (done) => {
			jest.clearAllMocks()

			const mockDate = new Date(1592156234000)
			jest
				.spyOn(global, 'Date')
				.mockImplementation(() => mockDate)

			const normTsLocation = path.join(__dirname, '/data/norm.ts')

			const ingestionEngine = new FileIngestionEngine(
				normTsLocation,
			)

			const normTsContents = JSON.stringify(fs.readFileSync(normTsLocation))

			const stream = new PassThrough()
			childProcess.spawn.mockReturnValueOnce({
				stdout: stream,
				stdin: stream,
				kill: jest.fn(),
			})
			ingestionEngine.producer = {
				send: jest.fn().mockResolvedValue(),
				connect: jest.fn().mockResolvedValue(),
				disconnect: jest.fn(),
			}

			ingestionEngine.start()

			ingestionEngine.producer.disconnect.mockImplementation(() => {
				const sentPayloadData = JSON.stringify(
					Buffer.from(
						[].concat(
							...ingestionEngine.producer.send.mock.calls.map(
								(call) => JSON.parse(call[0].messages[0].value).data.data,
							),
						),
					),
				)

				expect(sentPayloadData).toEqual(normTsContents)

				done()
			})
		})
	})
})

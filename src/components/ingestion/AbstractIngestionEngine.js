import { spawn } from 'child_process'
import { Payload } from '@tvkitchen/base-classes'
import { dataTypes } from '@tvkitchen/base-constants'
import {
	AbstractInstantiationError,
	NotImplementedError,
} from '@tvkitchen/base-errors'
import logger from '%src/lib/logger'
import kafka from '%src/lib/kafka'

class AbstractIngestionEngine {
	constructor() {
		if (this.constructor === AbstractIngestionEngine) {
			throw new AbstractInstantiationError(this.constructor.name)
		}
		this.producer = kafka.producer()
	}

	/**
	 * Ingests data into the TV Kitchen pipeline.
	 *
	 * @param  {Buffer} data The buffer of data to be ingested.
	 * @return {Boolean}     Whether or not the buffer was successfully ingested.
	 */
	ingestData = async (data) => {
		const payload = new Payload()
		payload.data = data
		await this.producer.send({
			topic: dataTypes.STREAM.DATA,
			messages: [{
				value: data,
			}],
		})
		return true
	}

	/**
	 * Continuously ingest of a stream of data.
	 *
	 * @param  {ReadableStream} readableStream The stream of data to be recorded.
	 * @return {ReadableStream}                The input stream (for chaining)
	 */
	recordStream = (readableStream) => readableStream
		.on('data', async (data) => {
			readableStream.pause()
			await this.ingestData(data)
			readableStream.resume()
		})

	/**
	 * Start the ingestion engine.
	 *
	 * @return {null}
	 */
	start = () => {
		const ffmpegSettings = this.getFfmpegSettings()
		const ffmpegProcess = spawn('ffmpeg', ffmpegSettings)
		const inputStream = this.getInputStream()
		if (inputStream !== null) {
			inputStream.pipe(ffmpegProcess.stdin)
		}
		this.recordStream(ffmpegProcess.stdout)
		logger.info(`Starting ingestion from ${this.constructor.name}...`)
	}

	/**
	 * Returns an ffmpeg settings array for this ingestion engine.
	 *
	 * @return {String[]} A list of ffmpeg command line parameters.
	 */
	getFfmpegSettings = () => [
		'-i', this.getInputLocation(),
		...this.getTranscodeSettings(),
		'-f', 'mpegts',
		'-',
	]

	/**
	 * Returns the input to be passed to ffmpeg's `-i` parameter.
	 *
	 * NOTE: If this is not overridden then getInputStream must be implemented.
	 *
	 * @return {String} The input location to be passed to ffmpeg
	 */
	getInputLocation = () => '-'

	/**
	 * The ReadableStream that is being ingested by the ingestion engine.
	 *
	 * NOTE: this must be implemented if getInputLocation returns `-`.
	 *
	 * @return {ReadableStream} The stream of data to be ingested by the ingestion engine.
	 */
	getInputStream = () => {
		if (this.getInputLocation() === '-') {
			throw new NotImplementedError('getInputStream')
		}
	}
}

export default AbstractIngestionEngine

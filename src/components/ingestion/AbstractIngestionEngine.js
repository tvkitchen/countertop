import { spawn } from 'child_process'
import {
	pipeline,
	Writable,
	Transform,
} from 'stream'
import { Payload } from '@tvkitchen/base-classes'
import { dataTypes } from '@tvkitchen/base-constants'
import {
	AbstractInstantiationError,
	NotImplementedError,
} from '@tvkitchen/base-errors'
import { TSDemuxer } from 'ts-demuxer'

import logger from '%src/lib/logger'
import kafka from '%src/lib/kafka'
import {
	tsToMilliseconds,
	generateEmptyPacket,
} from '%src/lib/utils/mpegts'

/**
 * The AbstractIngestionEngine handles the bulk of the stream processing associated with video
 * ingestion. Ingestion Engines that implement this class are responsible for defining the input
 * stream, and the abstract class will handle coordinating the input pipeline that ultimately
 * produces messages to the STREAM.CONTAINER Kafka queue.
 *
 * The pipeline consists of the following steps:
 *
 * 1. The input stream emits video data.
 * 2. That video data is piped to an FFmpeg spawn process in order to ensure the container format
 *    is MPEG-TS.
 * 3. The FFmpeg spawn process emits MPEG-TS data.
 * 4. That MPEG-TS data is processed by `TSDemuxer` in order to decorate it with the display
 *    timestamp (DTS).
 * 5. The decorated data is piped to Kafka as a TV Kitchen `Payload`.
 *
 * When the stream ends, the FFmpeg process and pipeline is shut down.
 */
class AbstractIngestionEngine {
	// The FFmpeg process used to wrap the ingestion stream in an MPEG-TS container
	ffmpegProcess = null

	// The ingestion stream consumed by this engine, started by `start()` and stopped by `stop()`
	activeInputStream = null

	// Utility for processing the MPEG-TS stream produced by ffmpeg
	mpegtsDemuxer = null

	// A shim variable that allows us to use the output of TSDemuxer in our engine
	mostRecentDemuxedPacket = null

	// Used to send processed STREAM.CONTAINER payloads to Kafka
	producer = null

	// A Transformation stream that will convert MPEG-TS data into TV Kitchen Payloads
	mpegtsProcessingStream = null

	// A Writeable stream that will ingest Payloads into the TV Kitchen pipeline.
	payloadIngestionStream = null

	constructor() {
		if (this.constructor === AbstractIngestionEngine) {
			throw new AbstractInstantiationError(this.constructor.name)
		}

		this.mpegtsDemuxer = new TSDemuxer(this.onDemuxedPacket)

		this.producer = kafka.producer()

		this.mpegtsProcessingStream = Transform({
			objectMode: true,
			transform: this.processMpegtsStreamData,
		})

		this.payloadIngestionStream = Writable({
			objectMode: true,
			write: this.ingestPayload,
		})
	}

	/**
	 * Ingests a TV Kitchen payload into the Kafka pipeline.
	 *
	 * This is invoked by Writeable streams, and so the method API is dictated by that specification.
	 *
	 * @param  {Payload}  payload The Payload to be ingested
	 * @param  {String}   enc     The encoding (part of the Node Stream API)
	 * @param  {Function} done    The callback for when the processing is complete
	 */
	ingestPayload = (payload, enc, done) => {
		if (!(payload instanceof Payload)) {
			done(new Error('ingestPayloadStream received non-Payload data'))
		} else {
			this.producer
				.send({
					topic: dataTypes.STREAM.CONTAINER,
					messages: [{
						value: Payload.serialize(payload),
					}],
				})
				.then((result) => done(null, result))
				.catch(done)
		}
	}

	/**
	 * Updates ingestion state based on the latest demuxed packet data.
	 *
	 * This method is called by our MPEG-TS demuxer, and allows the ingestion engine to track
	 * the most recent demuxed packet.
	 *
	 * @param  {Packet} packet The latest TSDemuxer Packet object
	 */
	onDemuxedPacket = (packet) => {
		this.mostRecentDemuxedPacket = packet
	}

	/**
	 * Returns the most recent coherent stream packet processed by the ingestion engine.
	 * This packet is lower level than the MPEG-TS container, and represents an audio or video
	 * packet demuxed from the MPEG-TS stream.
	 *
	 * @return {Packet} The most recent Packet object extracted by TSDemuxer
	 */
	getMostRecentDemuxedPacket = () => this.mostRecentDemuxedPacket

	/**
	 * Process a new chunk of data from an MPEG-TS stream. The chunks passed to this
	 * function should be presented sequentially, and combine to form a coherent MPEG-TS
	 * data stream, but they can be of arbitrary size.
	 *
	 * This method is called by a NodeJS Transform stream and so matches that spec.
	 *
	 * @param  {Buffer} mpegtsData The latest sequential chunk of MPEG-TS data
	 * @param  {String} enc        The encoding of the passed data
	 * @param  {Function(err,result)} done     A `(err, result) => ...` callback
	 *
	 */
	processMpegtsStreamData = (mpegtsData, enc, done) => {
		this.mpegtsDemuxer.process(mpegtsData)
		const demuxedPacket = this.getMostRecentDemuxedPacket() || generateEmptyPacket()
		const payload = new Payload({
			data: mpegtsData,
			type: dataTypes.STREAM.CONTAINER,
			duration: 0,
			position: tsToMilliseconds(demuxedPacket.pts),
			createdAt: (new Date()).toISOString(),
		})
		done(null, payload)
	}

	/**
	 * Start the ingestion engine.
	 *
	 * This creates an FFmpeg process configured to convert input into a predetermined
	 * format as specified by getFfmpegSettings, and announce new data to the ingestion
	 * engine.
	 *
	 * It then spawns the input stream as specified by the implementing class, and creates
	 * a pipeline that passes input->FFmpeg->packaging->ingestion
	 *
	 * @return {Stream} the ingestion pipeline that just got started
	 */
	start = async () => {
		this.ffmpegProcess = spawn('ffmpeg', this.getFfmpegSettings())
		await this.producer.connect()
		this.activeInputStream = this.getInputStream()

		logger.info(`Starting ingestion from ${this.constructor.name}...`)
		this.activeInputStream.pipe(this.ffmpegProcess.stdin)
		return pipeline(
			this.ffmpegProcess.stdout,
			this.mpegtsProcessingStream,
			this.payloadIngestionStream,
			() => this.stop(),
		)
	}

	/**
	 * Stop the ingestion engine.
	 *
	 * This stops the ingestion stream if it exists and terminates the FFmpeg process if it exists
	 */
	stop = () => {
		if (this.activeInputStream !== null) {
			this.activeInputStream.destroy()
		}
		if (this.ffmpegProcess !== null) {
			this.ffmpegProcess.kill()
		}
		this.producer.disconnect()
		logger.info(`Ended ingestion from ${this.constructor.name}...`)
	}

	/**
	 * Returns an FFmpeg settings array for this ingestion engine.
	 *
	 * @return {String[]} A list of FFmpeg command line parameters
	 */
	getFfmpegSettings = () => [
		'-loglevel', 'info',
		'-i', '-',
		'-codec', 'copy',
		'-f', 'mpegts',
		'-',
	]

	/**
	 * The ReadableStream that is being ingested by the ingestion engine.
	 *
	 * NOTE: THIS MUST BE IMPLEMENTED
	 *
	 * @return {ReadableStream} The stream of data to be ingested by the ingestion engine
	 */
	getInputStream = () => {
		throw new NotImplementedError('getInputStream')
	}
}

export default AbstractIngestionEngine

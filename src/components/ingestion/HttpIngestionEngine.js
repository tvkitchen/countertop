import { PassThrough } from 'stream'
import fetch from 'node-fetch'
import AbstractIngestionEngine from '%src/components/ingestion/AbstractIngestionEngine'

/**
 * The HttpIngestionEngine handles processing a HTTP video stream. It is a concrete
 * implementation of AbstractIngestionEngine, which reads in a stream,
 * converts it into an MPEG-TS stream represented as a series of Payloads,
 * and then pipes that to Kafka.
 *
 * @extends AbstractIngestionEngine
 */
class HttpIngestionEngine extends AbstractIngestionEngine {
	// The URL of the stream to read by the engine
	url = null

	/**
	 * Create a HttpIngestionEngine.
	 *
	 * @param  {string}  url The url of the stream to be ingested
	 */
	constructor(url) {
		super()
		if (!url) {
			throw new Error(
				'HttpIngestionEngine must be instantiated with a stream URL',
			)
		}

		this.url = url
	}

	/**
	 * @inheritdoc
	 */
	getInputStream = () => {
		const stream = new PassThrough()

		fetch(this.url)
			.then((response) => {
				response.body.pipe(stream)
			})
			.catch((err) => {
				stream.emit('error', err)
			})

		return stream
	}
}

export default HttpIngestionEngine

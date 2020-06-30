import http from 'http'
import https from 'https'
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
		if (!url) {
			throw new Error('HttpIngestionEngine must be instantiated with a stream URL')
		}
		super()

		this.url = url
	}

	/**
	 * The ReadableStream that is being ingested by the ingestion engine.
	 *
	 * @return {ReadableStream} The stream of data to be ingested by the ingestion engine
	 */
	getInputStream = () => {
		const request = this.url.startsWith('https://') ? https : http

		return request.get(this.url)
	}
}

export default HttpIngestionEngine

import ytdl from 'ytdl-core'
import AbstractIngestionEngine from '%src/components/ingestion/AbstractIngestionEngine'

/**
 * The YouTubeIngestionEngine handles processing a YouTube video stream. It is a concrete
 * implementation of AbstractIngestionEngine, which reads in a stream,
 * converts it into an MPEG-TS stream represented as a series of Payloads,
 * and then pipes that to Kafka.
 *
 * @extends AbstractIngestionEngine
 */
class YouTubeIngestionEngine extends AbstractIngestionEngine {
	// The URL of the stream to read by the engine
	url = null

	/**
	 * Create a YouTubeIngestionEngine.
	 *
	 * @param  {string}  url The url of the stream to be ingested
	 */
	constructor(url) {
		if (!url) {
			throw new Error(
				'YouTubeIngestionEngine must be instantiated with a stream URL',
			)
		}
		super()

		this.url = url
	}

	/**
	 * The ReadableStream that is being ingested by the ingestion engine.
	 *
	 * @return {ReadableStream} The stream of data to be ingested by the ingestion engine
	 */
	getInputStream = () => ytdl(this.url)
}

export default YouTubeIngestionEngine

import AbstractIngestionEngine from '../../AbstractIngestionEngine'

class FullyImplementedIngestionEngine extends AbstractIngestionEngine {
	constructor(readableStream) {
		super()
		this.readableStream = readableStream
	}

	getInputStream = () => this.readableStream
}

export default FullyImplementedIngestionEngine

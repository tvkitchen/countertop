import 'module-alias/register'
import { spawn } from 'child_process'

import logger from '%src/lib/logger'
import { chooseAvailableInternalStream } from '%src/lib/utils/ingest'

const ingestSource = process.argv[2]
if (!ingestSource) {
	logger.error('You must specify an input source.')
	process.exit()
}

const availableStreamAddress = chooseAvailableInternalStream()

logger.info(`Starting ingestion of "${ingestSource}"...`)

const ffmpeg = spawn('ffmpeg', [
	'-hide_banner',
	'-loglevel', 'panic',
	'-re',
	'-i', ingestSource, // This is actually profoundly unsafe; we should sanitize it
	'-f', 'mpegts',
	`udp://${availableStreamAddress}`,
])

ffmpeg.stdout.on('data', (data) => {
	logger.info(data)
})

// Annoyingly, ffmpeg actually sends all its expected output to stderr...
ffmpeg.stderr.on('data', (data) => {
	logger.error(data)
})

ffmpeg.on('close', () => {
	logger.info(`Finished ingestion of "${ingestSource}".`)
	process.exit()
})

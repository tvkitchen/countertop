import 'module-alias/register'
import logger from '%src/lib/logger'
import CountertopCoordinator from '%src/components/countertop/CountertopCoordinator'
import FileIngestionEngine from '%src/components/ingestion/FileIngestionEngine'

(async () => {
	const countertopCoordinator = new CountertopCoordinator()
	await countertopCoordinator.initializeCountertop()
	await countertopCoordinator.start()

	const fileIngestor = new FileIngestionEngine('/Users/slifty/Dropbox/Code/NodeJS/tvkitchen/tv-kitchen/2005101435.ts')
	fileIngestor.start()

	logger.info('Started.')
	process.on('SIGINT', () => {
		fileIngestor.stop()
		countertopCoordinator.stop()
	});
})()

import CountertopWorker from '%src/components/countertop/CountertopWorker'
import defaultConfig from '%src/constants/defaultConfig'

/**
 * The Countertop Coordinator (aka the Sous Chef) sets up and monitors all aspects of the
 * countertop to ensure the proper flow and processing of data.
 *
 * It is also the integration point between the Countertop and other system components.
 */
class CountertopCoordinator {
	workers = []

	loadConfiguration = () => defaultConfig // TODO: this is a temporary WIP approach

	initializeCountertop = () => {
		const config = this.loadConfiguration()
		config.appliances.forEach((applianceConfig) => {
			const worker = new CountertopWorker(applianceConfig)
			this.workers.push(worker)
		})
	}

	start = async () => {
		await this.workers.forEach(async (worker) => worker.start())
	}

	stop = async () => {
		await this.workers.forEach(async (worker) => worker.stop())
	}
}

export default CountertopCoordinator

import CountertopWorker from '../CountertopWorker'
import CountertopStation from '../CountertopStation'
import CountertopStream from '../CountertopStream'
import {
	generateMockAppliance,
} from '../../tools/utils/jest'

describe('CountertopWorker #unit', () => {
	describe('constructor', () => {
		it('Should emit an error if the worker was provided a non-IAppliance', () => {
			const Appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const station = new CountertopStation(Appliance)
			const stream = new CountertopStream(station)
			expect(() => new CountertopWorker(
				Object,
				null,
				{ stream },
			)).toThrow()
		})
	})

	describe('start', () => {
		it('should return false if the worker appliance fails its audit', async () => {
			const Appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
				audit: async () => false,
			})
			const station = new CountertopStation(Appliance)
			const stream = new CountertopStream(station)
			const worker = new CountertopWorker(
				Appliance,
				null,
				{ stream },
			)
			expect(await worker.start()).toBe(false)
		})
	})

	describe('stop', () => {

	})
})

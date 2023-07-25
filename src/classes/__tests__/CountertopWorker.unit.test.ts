import { Kafka } from 'kafkajs'
import {
	CountertopWorker,
	CountertopStream,
	CountertopStation,
} from '..'
import { generateMockAppliance } from '../../tools/test'
import { UnhealthyApplianceError } from '../../errors'

jest.mock('kafkajs')

describe('CountertopWorker #unit', () => {
	describe('start', () => {
		it('should return false if the worker appliance fails its audit', async () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
				healthCheck: async () => false,
			})
			const station = new CountertopStation(MockAppliance)
			const stream = new CountertopStream(station)
			const worker = new CountertopWorker(
				MockAppliance,
				undefined,
				{
					stream,
					kafka: new Kafka({
						brokers: [],
					}),
				},
			)
			await expect(worker.start())
				.rejects
				.toThrow(UnhealthyApplianceError)
		})
	})
})

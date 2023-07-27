import { Countertop } from '../Countertop'
import { CountertopStation } from '../CountertopStation'
import { generateMockAppliance } from '../../tools/test'
import { CountertopState } from '../../types'

jest.mock('kafkajs')

describe('Countertop #unit', () => {
	describe('addAppliance', () => {
		it('Should generate a station for the new appliance', () => {
			const countertop = new Countertop()
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			expect(countertop.addAppliance(appliance)).toBeInstanceOf(CountertopStation)
		})
	})

	describe('start', () => {
		it('should start properly when run with no appliances', async () => {
			const countertop = new Countertop()
			await expect(countertop.start())
				.resolves
				.not.toThrow()
			expect(countertop.state).toBe(CountertopState.Started)
		})
	})

	describe('stop', () => {
		it('should stop properly when run with no appliances', async () => {
			const countertop = new Countertop()
			await expect(countertop.stop())
				.resolves
				.not.toThrow()
			expect(countertop.state).toBe(CountertopState.Stopped)
		})
	})
})

import { countertopStates } from '../../constants'
import Countertop from '../Countertop'
import CountertopStation from '../CountertopStation'
import CountertopTopology from '../CountertopTopology'
import {
	generateMockAppliance,
} from '../../tools/utils/jest'

jest.mock('kafkajs')

describe('Countertop #unit', () => {
	describe('constructor', () => {
		it('Should accept a custom logger', () => {
			const logger = {}
			const countertop = new Countertop({ logger })
			expect(countertop.logger).toBe(logger)
		})
	})

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
		it('should return true when run with no appliances', async () => {
			const countertop = new Countertop()
			expect(await countertop.start()).toBe(true)
		})
		it('should return false when a station does not start', async () => {
			const station = {
				start: async () => false,
			}
			const countertop = new Countertop()
			countertop.stations = [station]
			expect(await countertop.start()).toBe(false)
		})
		it('should update state to ERRORED when a station does not start', async () => {
			const station = {
				start: async () => false,
			}
			const countertop = new Countertop()
			countertop.stations = [station]
			await countertop.start()
			expect(countertop.state).toBe(countertopStates.ERRORED)
		})
	})

	describe('stop', () => {
		it('should return true when run with no appliances', async () => {
			const countertop = new Countertop()
			expect(await countertop.stop()).toBe(true)
		})
		it('should return false when a station does not stop', async () => {
			const station = {
				stop: async () => false,
			}
			const countertop = new Countertop()
			countertop.stations = [station]
			expect(await countertop.stop()).toBe(false)
		})
		it('should update state to ERRORED when a station does not stop', async () => {
			const station = {
				stop: async () => false,
			}
			const countertop = new Countertop()
			countertop.stations = [station]
			await countertop.stop()
			expect(countertop.state).toBe(countertopStates.ERRORED)
		})
	})

	describe('updateTopology', () => {
		it('should return a CountertopTopology when run with no appliances', () => {
			const countertop = new Countertop()
			expect(countertop.updateTopology()).toBeInstanceOf(CountertopTopology)
		})
		it('should error when run on a started countertop', () => {
			const countertop = new Countertop()
			countertop.state = countertopStates.STARTED
			expect(() => countertop.updateTopology()).toThrow()
		})
	})
})

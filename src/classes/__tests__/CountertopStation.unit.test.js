import { Kafka } from 'kafkajs'
import CountertopStation from '../CountertopStation'
import CountertopTopology from '../CountertopTopology'
import {
	generateMockAppliance,
} from '../../tools/utils/jest'

jest.mock('kafkajs')

describe('CountertopStation #unit', () => {
	describe('constructor', () => {
		it('Should require an appliance', () => {
			expect(() => new CountertopStation())
				.toThrow()
		})

		it('Should accept a custom logger', () => {
			const logger = {}
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const countertopStation = new CountertopStation(
				appliance,
				{},
				{ logger },
			)
			expect(countertopStation.logger).toBe(logger)
		})
	})

	describe('invokeTopology', () => {
		it('Should return an empty array when sent an empty toplogy', async () => {
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const countertopStation = new CountertopStation(appliance)
			const topology = new CountertopTopology()
			const workers = await countertopStation.invokeTopology(topology)
			expect(workers).toEqual([])
		})

		it('Should return workers if the station is part of the toplogy', async () => {
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['bar'],
			})
			const countertopStation = new CountertopStation(
				appliance,
				{},
				{ kafka: new Kafka() },
			)
			const topology = new CountertopTopology([countertopStation])
			const workers = await countertopStation.invokeTopology(topology)
			expect(workers.length).toEqual(1)
		})
	})

	describe('start', () => {
		it('should return true when assigned no streams', async () => {
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const countertopStation = new CountertopStation(appliance)
			expect(await countertopStation.start()).toBe(true)
		})
	})

	describe('stop', () => {
		it('should return true when assigned no streams', async () => {
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const countertopStation = new CountertopStation(appliance)
			expect(await countertopStation.stop()).toBe(true)
		})
	})

	describe('getInputTypes', () => {
		it('should return the input types of its appliance', () => {
			const appliance = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const countertopStation = new CountertopStation(appliance)
			expect(countertopStation.getInputTypes()).toEqual(['foo'])
		})

		it('should pass settings to appliance getInputTypes', () => {
			const appliance = generateMockAppliance({
				getInputTypes: (settings) => settings.inputTypes,
			})
			const settings = {
				inputTypes: ['foo'],
			}
			const countertopStation = new CountertopStation(
				appliance,
				settings,
			)
			expect(countertopStation.getInputTypes()).toEqual(['foo'])
		})
	})

	describe('getOutputTypes', () => {
		it('should return the output types of its appliance', () => {
			const appliance = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const countertopStation = new CountertopStation(appliance)
			expect(countertopStation.getOutputTypes()).toEqual(['bar'])
		})

		it('should pass settings to appliance getOutputTypes', () => {
			const appliance = generateMockAppliance({
				getOutputTypes: (settings) => settings.outputTypes,
			})
			const settings = {
				outputTypes: ['bar'],
			}
			const countertopStation = new CountertopStation(
				appliance,
				settings,
			)
			expect(countertopStation.getOutputTypes()).toEqual(['bar'])
		})
	})
})

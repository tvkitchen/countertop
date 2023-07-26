import { Kafka } from 'kafkajs'
import { CountertopStation } from '../CountertopStation'
import { CountertopTopology } from '../CountertopTopology'
import { AbstractAppliance } from '../AbstractAppliance'
import {
	generateMockAppliance,
	generateMockLogger,
} from '../../tools/test'

jest.mock('kafkajs')

describe('CountertopStation #unit', () => {
	describe('constructor', () => {
		it('Should accept a custom logger', () => {
			const logger = generateMockLogger()
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const countertopStation = new CountertopStation(
				appliance,
				{},
				{
					logger,
					kafka: new Kafka({ brokers: [] }),
				},
			)
			expect(countertopStation.settings.logger).toBe(logger)
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
			const workers = countertopStation.invokeTopology(topology)
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
				{ kafka: new Kafka({ brokers: [] }) },
			)
			const topology = new CountertopTopology([countertopStation])
			const workers = countertopStation.invokeTopology(topology)
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
			await expect(countertopStation.start())
				.resolves.not.toThrow()
		})
	})

	describe('stop', () => {
		it('should return true when assigned no streams', async () => {
			const appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const countertopStation = new CountertopStation(appliance)
			await expect(countertopStation.stop())
				.resolves.not.toThrow()
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

		it('should pass settings when collecting input types', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: ['foo', 'foo2'],
				outputTypes: ['bar'],
			})
			const settings = {
				inputTypeFilter: ['foo'],
			}
			const countertopStation = new CountertopStation(
				MockAppliance,
				settings,
			)
			const getInputTypesSpy = jest.spyOn(AbstractAppliance, 'getInputTypes')
			expect(countertopStation.getInputTypes()).toEqual(['foo'])
			expect(getInputTypesSpy).toHaveBeenCalledWith(settings)
			getInputTypesSpy.mockClear()
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
			const MockAppliance = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'bar2'],
			})
			const settings = {
				outputTypeFilter: ['bar'],
			}
			const countertopStation = new CountertopStation(
				MockAppliance,
				settings,
			)
			const getOutputTypesSpy = jest.spyOn(AbstractAppliance, 'getOutputTypes')
			expect(countertopStation.getOutputTypes()).toEqual(['bar'])
			expect(getOutputTypesSpy).toHaveBeenCalledWith(settings)
			getOutputTypesSpy.mockClear()
		})
	})
})

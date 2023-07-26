import assert from 'assert'
import { CountertopStream } from '../CountertopStream'
import { CountertopStation } from '../CountertopStation'
import { generateMockAppliance } from '../../tools/test'

describe('CountertopStream #unit', () => {
	describe('constructor', () => {
		it('Should not require tributaries for all inputs', () => {
			const Appliance = generateMockAppliance({
				inputTypes: ['bar'],
				outputTypes: [],
			})
			const station = new CountertopStation(Appliance)
			const stream = new CountertopStream(station)
			expect(stream.mouth).toBe(station)
			expect(stream.source).toBe(undefined)
		})

		it('Should throw an error when passed irrelevant tributaries', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['bar'],
				outputTypes: ['baz'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			expect(() => new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)).toThrow(assert.AssertionError)
		})
	})

	describe('source', () => {
		it('Should be the core station if it is a source station', () => {
			const Appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const station = new CountertopStation(Appliance)
			const stream = new CountertopStream(station)
			expect(stream.source).toBe(station)
		})

		it('Should return the source station', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			expect(streamB.source).toBe(stationA)
		})
	})

	describe('mouth', () => {
		it('Should be the core station', () => {
			const Appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const station = new CountertopStation(Appliance)
			const stream = new CountertopStream(station)
			expect(stream.mouth).toBe(station)
		})
	})

	describe('tributaries', () => {
		it('Should match the provided tributaries', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			const tributaryMap = streamB.tributaries
			expect(tributaryMap.get('foo')).toBe(streamA)
		})
	})

	describe('getTributaryArray', () => {
		it('Should return a tributary map', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			const tributaryArray = streamB.getTributaryArray()
			expect(tributaryArray).toContain(streamA)
		})
	})

	describe('getLength', () => {
		it('Should have length 1 if it is a source stream', () => {
			const Appliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			const station = new CountertopStation(Appliance)
			const stream = new CountertopStream(station)
			expect(stream.getLength()).toBe(1)
		})

		it('Should have the correct length', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			expect(streamB.getLength()).toBe(2)
		})
	})

	describe('includesStation', () => {
		it('Should return true if a station is in the stream', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			expect(streamB.includesStation(stationA)).toBe(true)
			expect(streamB.includesStation(stationB)).toBe(true)
		})

		it('Should return false if a station is not in the stream', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			expect(streamA.includesStation(stationB)).toBe(false)
		})
	})

	describe('includesStream', () => {
		it('should return true if a stream is a tributary', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			expect(streamB.includesStream(streamA)).toBe(true)
		})

		it('should return false if a stream is not a tributary or sub-tributary', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const ApplianceC = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['bar'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const stationC = new CountertopStation(ApplianceC)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			const streamC = new CountertopStream(stationC)
			expect(streamB.includesStream(streamC)).toBe(false)
		})
	})

	describe('getOutputTypes', () => {
		it('Should return the output types of the mouth station', () => {
			const ApplianceA = generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			})
			const ApplianceB = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			})
			const stationA = new CountertopStation(ApplianceA)
			const stationB = new CountertopStation(ApplianceB)
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(
				stationB,
				new Map([['foo', streamA]]),
			)
			expect(streamB.getOutputTypes()).toEqual(['bar', 'baz'])
		})
	})
})

import { IAppliance } from '@tvkitchen/base-interfaces'
import {
	CountertopStation,
	CountertopStream,
} from '../../../classes'
import {
	loadTestData,
	generateMockAppliance,
	normalizeTributaryMap,
	normalizeTributaryMaps,
	normalizeStream,
	normalizeStreams,
} from '../jest'

describe('jest', () => {
	describe('loadTestData', () => {
		it('should load data when valid json is provided', () => {
			expect(loadTestData(__dirname, 'loadTestData.json')).toEqual(['this loads valid json'])
		})
	})

	describe('generateMockAppliance', () => {
		it('Should generate an IAppliance with the proper input / output types', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			})
			const mockAppliance = new MockAppliance()
			expect(IAppliance.isIAppliance(mockAppliance)).toBe(true)
			expect(MockAppliance.getInputTypes()).toEqual(['foo'])
			expect(MockAppliance.getOutputTypes()).toEqual(['bar'])
		})
	})

	describe('normalizeTributaryMap', () => {
		it('should replace stations with the correct index in a single tributary map', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const stationC = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationD = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo', 'bar'],
				outputTypes: ['baz'],
			}))
			const stations = [
				stationA,
				stationB,
				stationC,
				stationD,
			]
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const tributaryMap = new Map([
				['foo', streamA],
				['bar', streamB],
			])
			const result = normalizeTributaryMap(tributaryMap, stations)
			expect(result).toMatchSnapshot()
		})
	})

	describe('normalizeTributaryMaps', () => {
		it('should replace stations with correct index in an array of tributary maps', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const stationC = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationD = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo', 'bar'],
				outputTypes: ['baz'],
			}))
			const stations = [
				stationA,
				stationB,
				stationC,
				stationD,
			]
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streamC = new CountertopStream(stationC)
			const tributaryMapA = new Map([
				['foo', streamA],
				['bar', streamB],
			])
			const tributaryMapB = new Map([
				['foo', streamC],
			])
			const tributaryMaps = [
				tributaryMapA,
				tributaryMapB,
			]
			const result = normalizeTributaryMaps(tributaryMaps, stations)
			expect(result).toMatchSnapshot()
		})
	})

	describe('normalizeStream', () => {
		it('should replace stations with the correct index in a stream', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const stationC = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationD = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo', 'bar'],
				outputTypes: ['baz'],
			}))
			const stations = [
				stationA,
				stationB,
				stationC,
				stationD,
			]
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const result = normalizeStream(streamB, stations)
			expect(result).toMatchSnapshot()
		})
	})

	describe('normalizeStreams', () => {
		it('should replace stations with the correct index in an array of streams', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const stationC = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationD = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo', 'bar'],
				outputTypes: ['baz'],
			}))
			const stations = [
				stationA,
				stationB,
				stationC,
				stationD,
			]
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streams = [
				streamA,
				streamB,
			]
			const result = normalizeStreams(streams, stations)
			expect(result).toMatchSnapshot()
		})
	})
})

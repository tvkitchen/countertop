import { by } from '..'
import CountertopStation from '../../../classes/CountertopStation'
import CountertopStream from '../../../classes/CountertopStream'
import {
	generateMockAppliance,
	normalizeTributaryMaps,
} from '../jest'
import {
	getSourceStations,
	getLongestStreamLength,
	getCollectiveOutputTypes,
	getStationsThatConsumeTypes,
	getStreamsThatProduceTypes,
	filterStreamsContainingStation,
	getStreamOutputMap,
	getSourcesFromStreams,
	getStreamsFromStreamMap,
	getSourcesFromStreamMap,
	generateTributaryMaps,
} from '../countertop'

describe('countertop', () => {
	describe('getSourceStations', () => {
		it('Should extract stations that have no inputs', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			}))
			const stations = [
				stationA,
				stationB,
			]
			const sourceStations = getSourceStations(stations)
			expect(sourceStations).toEqual([stationA])
		})
	})

	describe('getLongestStreamLength', () => {
		it('should return the length of the longest stream', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar'],
			}))
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streams = [
				streamA,
				streamB,
			]
			expect(getLongestStreamLength(streams)).toBe(2)
		})
	})

	describe('getCollectiveOutputTypes', () => {
		it('should return the output types of multiple streams', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streams = [
				streamA,
				streamB,
			]
			const collectiveOutputTypes = getCollectiveOutputTypes(streams)
			expect(collectiveOutputTypes.sort()).toEqual(
				['foo', 'bar', 'baz'].sort(),
			)
		})
	})

	describe('getStationsThatConsumeTypes', () => {
		it('should return the stations that consume the specified types', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: ['red'],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const stations = [
				stationA,
				stationB,
			]
			const result = getStationsThatConsumeTypes(stations, ['foo'])
			expect(result).toEqual([stationB])
		})
	})

	describe('getStreamsThatProduceTypes', () => {
		it('should return the streams that produce the specified types', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streamC = new CountertopStream(stationA)
			const streams = [
				streamA,
				streamB,
				streamC,
			]
			const result = getStreamsThatProduceTypes(streams, ['foo'])
			expect(result.sort(by('id'))).toEqual([streamA, streamC].sort(by('id')))
		})
	})

	describe('filterStreamsContainingStation', () => {
		it('should remove streams that contain a given station', () => {
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
				outputTypes: ['bloo'],
			}))
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streamC = new CountertopStream(stationC)
			const streams = [
				streamA,
				streamB,
				streamC,
			]
			const result = filterStreamsContainingStation(streams, stationA)
			expect(result).toEqual([streamC])
		})
	})

	describe('getStreamOutputMap', () => {
		it('should map streams by their output types', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo'],
				outputTypes: ['bar', 'baz'],
			}))
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streams = [
				streamA,
				streamB,
			]
			const result = getStreamOutputMap(streams)
			expect(result).toEqual(new Map([
				['foo', [streamA]],
				['bar', [streamB]],
				['baz', [streamB]],
			]))
		})
	})

	describe('getSourcesFromStreams', () => {
		it('should return all sources represented by streams', () => {
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
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streamC = new CountertopStream(stationC)
			const streams = [
				streamB,
				streamC,
			]
			const result = getSourcesFromStreams(streams)
			expect(result.sort(by('id'))).toEqual([stationA, stationC].sort(by('id')))
		})
	})

	describe('getStreamsFromStreamMap', () => {
		it('should return the streams represented in a stream map', () => {
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
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streamC = new CountertopStream(stationC)
			const streamMap = new Map([
				['foo', [streamA, streamC]],
				['bar', [streamB]],
				['baz', [streamB]],
			])
			const result = getStreamsFromStreamMap(streamMap)
			expect(result.sort(by('id'))).toEqual(
				[streamA, streamB, streamC].sort(by('id')),
			)
		})
	})

	describe('getSourcesFromStreamMap', () => {
		it('should return the set of sources represented in a stream map', () => {
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
			const streamA = new CountertopStream(stationA)
			const streamB = new CountertopStream(stationB, new Map([['foo', streamA]]))
			const streamC = new CountertopStream(stationC)
			const streamMap = new Map([
				['foo', [streamA, streamC]],
				['bar', [streamB]],
				['baz', [streamB]],
			])
			const result = getSourcesFromStreamMap(streamMap)
			expect(result.sort(by('id'))).toEqual(
				[stationA, stationC].sort(by('id')),
			)
		})
	})

	describe('generateTributaryMaps', () => {
		it('should not create tributary maps of streams with different sources', () => {
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
			const streamMap = new Map([
				['foo', [streamA, streamC]],
				['bar', [streamB]],
				['baz', [streamB]],
			])
			const result = generateTributaryMaps(stationD, streamMap)
			expect(normalizeTributaryMaps(result, stations)).toMatchSnapshot()
		})

		it('should return a partially populated tributary map if there are not enough outputs for all inputs', () => {
			const stationA = new CountertopStation(generateMockAppliance({
				inputTypes: [],
				outputTypes: ['foo'],
			}))
			const stationB = new CountertopStation(generateMockAppliance({
				inputTypes: ['foo', 'bar'],
				outputTypes: ['baz'],
			}))
			const stations = [
				stationA,
				stationB,
			]
			const streamA = new CountertopStream(stationA)
			const streamMap = new Map([
				['foo', [streamA]],
			])
			const result = generateTributaryMaps(stationB, streamMap)
			expect(normalizeTributaryMaps(result, stations)).toMatchSnapshot()
		})
	})
})

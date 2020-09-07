import fs from 'fs'
import path from 'path'
import { IAppliance } from '@tvkitchen/base-interfaces'

/**
 * Loads a file containing JSON from the test's `data` directory and returns the resulting object.
 *
 * @param  {String} fileName The name of the file located in the `data` directory
 */
export const loadTestData = (testDirectory, fileName) => JSON.parse(fs.readFileSync(
	path.join(testDirectory, 'data', fileName),
))

/**
 * Creates a mock appliance class
 *
 * @param  {String[]} options.inputTypes  The mocked input types value.
 * @param  {String[]} options.outputTypes The mocked output types value.
 * @return {Class}                        The resulting mock class.
 */
export const generateMockAppliance = ({
	inputTypes,
	outputTypes,
	audit = async () => true,
	start = async () => true,
	stop = async () => true,
}) => {
	class MockAppliance extends IAppliance {
		static getInputTypes = () => inputTypes

		static getOutputTypes = () => outputTypes

		on = () => true

		audit = audit

		start = start

		stop = stop
	}
	return MockAppliance
}

/**
 * Normalize a tributary map so that all stations are replaced with a normalized
 * index.
 *
 * @param  {Map}                 streamMap The stream map to normalize.
 * @param  {CountertopStation[]} stations  The stations being normalized.
 * @return {Map}                           The normalized stream map.
 */
export const normalizeTributaryMap = (streamMap, stations) => {
	const normalizedTributaryMap = new Map()
	streamMap.forEach(
		(value, key) => {
			normalizedTributaryMap.set(
				key,
				// https://github.com/eslint/eslint/issues/12473
				// eslint-disable-next-line no-use-before-define
				normalizeStream(value, stations),
			)
		},
	)
	return normalizedTributaryMap
}

/**
 * Normalize an array of tributary maps so that all stations are replaced with a
 * normalized index.
 *
 * @param  {Map[]}               streamMap The stream maps to normalize.
 * @param  {CountertopStation[]} stations  The stations being normalized.
 * @return {Map[]}                         The normalized stream maps.
 */
export const normalizeTributaryMaps = (streamMaps, stations) => streamMaps.map(
	(streamMap) => normalizeTributaryMap(streamMap, stations),
)

/**
 * Normalizes a stream so that all station references are replaced with a normalized
 * index.
 *
 * @param  {CountertopStream}    stream   The stream to normalize.
 * @param  {CountertopStation[]} stations The stations being normalized.
 * @return {CountertopStream}             The normalized stream.
 */
export const normalizeStream = (stream, stations) => ({
	source: stations.findIndex((station) => station.id === stream.getSource().id),
	mouth: stations.findIndex((station) => station.id === stream.getMouth().id),
	tributaryMap: normalizeTributaryMap(stream.getTributaryMap(), stations),
})

/**
 * Normalizes an array of streams so that all station references are replaced with a normalized
 * index.
 *
 * @param  {CountertopStream[]}  stream   The streams to normalize.
 * @param  {CountertopStation[]} stations The stations being normalized.
 * @return {CountertopStream[]}           The normalized streams.
 */
export const normalizeStreams = (streams, stations) => streams.map(
	(stream) => normalizeStream(stream, stations),
)

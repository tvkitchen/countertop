import CountertopStream from './CountertopStream'
import {
	getCollectiveOutputTypes,
	getStationsThatConsumeTypes,
	getLongestStreamLength,
	filterStreamsContainingStation,
	generateTributaryMaps,
	getStreamOutputMap,
	getSourceStations,
} from '../tools/utils/countertop'

/**
 * CountertopToplogies are a complete set of valid *paths* that data might take across a given
 * array of CountertopStations.
 *
 * The distinction of paths (as opposed to edges / direct steps) is important, as a given payload
 * will have a source, and only payloads with a common source should be considered together in
 * the case of dual-input appliances.
 *
 * In many data processing pipelines, topologies need to be manually specified by the developer
 * configuring the system. In this case, the topologies are automatically generated based on which
 * appliances produce outputs that are valid inputs to others.
 *
 * The logic for generating a CountertopTopology starts in the static `generateStreams` method.
 */
class CountertopTopology {
	stations = []

	streams = []

	/**
	 * Create a CountertopTopology.
	 *
	 * @param  {CountertopStation[]} stations The stations used to define the topology.
	 */
	constructor(stations = []) {
		this.stations = stations
		this.streams = CountertopTopology.generateStreams(this.stations)
	}

	/**
	 * Extend a set of streams by a single station.
	 *
	 * This will only create streams that pull from the same source.
	 * This will generate and return any valid streams that extend a given stream set.
	 * This will ONLY return new streams, which means if no valid streams extensions exist, it will
	 * return an empty array.
	 * This will not create streams that re-visit a given station (no loops).
	 *
	 * @param  {CountertopStream[]}  streams The set of streams to be extended.
	 * @param  {CountertopStation[]} station The station being used to extend.
	 * @return {CountertopStream[]}          The extended streams.
	 */
	static extendStreamsByStation = (streams, station) => {
		const streamOutputMap = getStreamOutputMap(
			filterStreamsContainingStation(streams),
		)
		const tributaryMaps = generateTributaryMaps(
			station,
			streamOutputMap,
		)
		return tributaryMaps.map(
			(tributaryMap) => new CountertopStream(station, tributaryMap),
		)
	}

	/**
	 * Fully extends a set of streams to flow through a set of new stations.
	 *
	 * This will only create streams that pull from the same source.
	 * This will not create streams that re-visit a given station (no loops).
	 * This will create distinct streams for incremental steps from a source (e.g. A->B, and A->B->C).
	 *
	 * @param  {CountertopStream[]}  streams  The base set of streams being extended.
	 * @param  {CountertopStation[]} stations The stations being used to extend the streams.
	 * @return {CountertopStream[]}           The complete set of streams.
	 */
	static generateStreams = (stations, streams = []) => {
		let nextStreams = []
		if (streams.length === 0) {
			nextStreams = CountertopTopology.generateSourceStreams(stations)
		} else {
			const extentionLength = 1 + getLongestStreamLength(streams)
			const outputTypes = getCollectiveOutputTypes(streams)
			const nextStations = getStationsThatConsumeTypes(stations, outputTypes)
			nextStreams = nextStations.flatMap(
				(station) => CountertopTopology.extendStreamsByStation(streams, station),
			)
				// Remove any new streams that aren't long enough
				.filter((stream) => stream.getLength() === extentionLength)
		}
		// If there were any new streams, iterate again
		if (nextStreams.length !== 0) {
			return CountertopTopology.generateStreams(stations, streams.concat(nextStreams))
		}
		return streams
	}

	/**
	 * Generates streams that only include source stations.
	 *
	 * These stream will, by defintiion, be of length 1.
	 *
	 * @param  {CountertopStations[]} stations The stations to be processed.
	 * @return {CountertopStreams[]}           The resulting streams.
	 */
	static generateSourceStreams = (stations) => getSourceStations(stations)
		.map((station) => new CountertopStream(station))
}

export default CountertopTopology

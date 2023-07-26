import {
	getCollectiveOutputTypes,
	getStationsThatConsumeTypes,
	getLongestStreamLength,
	filterStreamsContainingStation,
	generateTributaryMaps,
	getStreamOutputMap,
	getSourceStations,
	identifyObsoleteStreams,
	pruneStreams,
} from '../tools/utils/countertop'
import { CountertopStream } from './CountertopStream'
import { CountertopStation } from './CountertopStation'

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
export class CountertopTopology {
	stations: CountertopStation[]

	streams: CountertopStream[]

	constructor(stations: CountertopStation[] = []) {
		this.stations = stations
		this.streams = CountertopTopology.generateStreams(this.stations)
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
	public static generateStreams(
		stations: CountertopStation[],
		streams: CountertopStream[] = [],
	): CountertopStream[] {
		let nextStreams = []
		if (streams.length === 0) {
			nextStreams = CountertopTopology.generateSourceStreams(stations)
		} else {
			const extentionLength = 1 + getLongestStreamLength(streams)
			const outputTypes = getCollectiveOutputTypes(streams)
			const nextStations = getStationsThatConsumeTypes(stations, outputTypes)
			nextStreams = nextStations.flatMap(
				// Disable until countertop utilities get types
				// eslint-disable-next-line
				(station) => CountertopTopology.extendStreamsByStation(streams, station),
			)
				// Remove any new streams that aren't long enough
				.filter((stream) => stream.getLength() === extentionLength)
		}
		// Prune any past streams whose tributaries are explicit subsets of new streams
		const obsoleteStreams = identifyObsoleteStreams(streams, nextStreams)
		// Disable until countertop utilities get types
		// eslint-disable-next-line
		const prunedStreams = pruneStreams(streams, obsoleteStreams)
		// Disable until countertop utilities get types
		// eslint-disable-next-line
		const prunedNextStreams = pruneStreams(nextStreams, obsoleteStreams)

		// If there were any new streams, iterate again
		// Disable until countertop utilities get types
		// eslint-disable-next-line
		if (prunedNextStreams.length !== 0) {
			return CountertopTopology.generateStreams(
				stations,
				// Disable until countertop utilities get types
				// eslint-disable-next-line
				prunedStreams.concat(prunedNextStreams),
			)
		}
		// Disable until countertop utilities get types
		// eslint-disable-next-line
		return prunedStreams
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
	private static extendStreamsByStation(
		streams: CountertopStream[],
		station: CountertopStation,
	): CountertopStream[] {
		const streamOutputMap = getStreamOutputMap(
			filterStreamsContainingStation(streams, station),
		)
		const tributaryMaps = generateTributaryMaps(
			station,
			streamOutputMap,
		)
		return tributaryMaps.map(
			// Disable until countertop utilities get types
			// eslint-disable-next-line
			(tributaryMap) => new CountertopStream(station, tributaryMap),
		)
	}

	/**
	 * Generates streams that only include source stations.
	 *
	 * These streams will, by defintiion, be of length 1.
	 *
	 * @param  {CountertopStations[]} stations The stations to be processed.
	 * @return {CountertopStreams[]}           The resulting streams.
	 */
	private static generateSourceStreams(stations: CountertopStation[]) {
		return getSourceStations(stations)
			// Disable until countertop utilities get types
			// eslint-disable-next-line
			.map((station) => new CountertopStream(station))
	}
}

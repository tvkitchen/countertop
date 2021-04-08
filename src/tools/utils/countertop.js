import { arraysHaveOverlap } from '.'
import { sanitizeTopic } from './kafka'

/**
 * Returns a list of stations that are considered sources.
 *
 * The only way a station can currently be a source is if it has no inputs.
 * This definition may expand over time.
 *
 * @param  {CountertopStation[]} stations The stations being processed.
 * @return {CountertopStation[]}          The source stations.
 */
export const getSourceStations = (stations) => stations.filter(
	(station) => station.getInputTypes().length === 0,
)

/**
 * Returns the length (number of stations) of the longest CountertopStream in a set
 * of CountertopStreams.
 *
 * @param  {CountertopStream[]} streams The streams being processed.
 * @return {Number}                     The longest length.
 */
export const getLongestStreamLength = (streams) => Math.max(
	...streams.map((stream) => stream.getLength()),
	0,
)

/**
 * Returns a list of any type produced by any stream in the set.
 *
 * @param  {CountertopStream[]} streams The CountertopStreams being processed.
 * @return {String[]}                   The types produced by any of those CountertopStreams.
 */
export const getCollectiveOutputTypes = (streams) => [
	...new Set(streams.flatMap((stream) => stream.getOutputTypes())),
]

/**
 * Returns a subset of stations that consume any of the specified types
 *
 * @param  {CountertopStation[]} stations The array of stations to search.
 * @param  {String[]}            types    The types that are being searched for.
 * @return {CountertopStation[]}          The filtered array of stations
 */
export const getStationsThatConsumeTypes = (stations, types) => stations.filter(
	(station) => arraysHaveOverlap(
		station.getInputTypes(),
		types,
	),
)

/**
 * Returns a subset of streams that produce any of the specified types.
 *
 * @param  {CountertopStream[]} streams The array of streams to search.
 * @param  {String[]}           types   The types that are being searched for.
 * @return {CountertopStream[]}         The filtered array of streams
 */
export const getStreamsThatProduceTypes = (streams, types) => streams.filter(
	(stream) => arraysHaveOverlap(
		stream.getOutputTypes(),
		types,
	),
)

/**
 * Returns a subset of streams that do not contain a given station.
 *
 * @param  {CountertopStream[]} streams The array of streams to search.
 * @param  {CountertopStation}  station The station being filtered out.
 * @return {CountertopStream[]}         The filtered array of streams.
 */
export const filterStreamsContainingStation = (streams, station) => streams
	.filter((stream) => !stream.includesStation(station))

/**
 * Generates a Map of type / stream[] pairs based on streams who output the types.
 *
 * @param  {CountertopStream[]} streams The CountertopStreams being mapped.
 * @return {Map}                        The resulting map of types => streams
 */
export const getStreamOutputMap = (streams) => new Map(
	getCollectiveOutputTypes(streams).map(
		(type) => [
			type,
			getStreamsThatProduceTypes(streams, [type]),
		],
	),
)

/**
 * Get an array of distinct sources reflected inside of an Array of streams.
 *
 * This will return exactly one copy of any source represented in those streams.
 *
 * @param  {CountetopStream[]}   streams An array ofstreams
 * @return {CountertopStation[]}         An array of distinct sources for the streams.
 */
export const getSourcesFromStreams = (streams) => [...new Set(
	streams.map(
		(stream) => stream.getSource(),
	),
)]

/**
 * Get an array of unique streams represented in a map of streams.
 *
 * @param  {Map<CountertopStream[]>} streamMap The stream map to be processed.
 * @return {CountertopStream[]}                The unique streams contained in the map.
 */
export const getStreamsFromStreamMap = (streamMap) => [
	...new Set([...streamMap.values()].flat()),
]

/**
 * Get an array of distinct sources reflected inside of a stream Map.
 *
 * This will return exactly one copy of any source represented in those streams.
 *
 * @param  {Map<CountetopStream[]>} streamMap A Map containing streams
 * @return {CountertopStation[]}              An array of distinct sources for the streams.
 */
export const getSourcesFromStreamMap = (streamMap) => getSourcesFromStreams(
	getStreamsFromStreamMap(streamMap),
)

/**
 * Create all sets of valid stream combinations that can sufficiently fulfill a set of inputs
 *
 * This will only create combinations of streams that pull from the same source.
 * This will not return incomplete tributary maps (i.e. tributary maps will have exactly one stream
 * per input).
 *
 * @param  {CountertopStation}       station         The station whose tributaries are being mapped.
 * @param  {Map<CountertopStream[]>} streamOutputMap A map of of streams grouped by output type.
 * @return {Map<CountertopStream>[]}                 A map of tributary streams for a set of inputs.
 */
export const generateTributaryMaps = (station, streamOutputMap) => {
	const sources = getSourcesFromStreamMap(streamOutputMap)
	const tributarySeeds = sources.map((source) => new Map([['source', source]]))
	const inputTypes = station.getInputTypes()
	return inputTypes.reduce(
		(accumulator, type) => accumulator.flatMap(
			(tributarySet) => {
				const expandedTributarySets = (streamOutputMap.get(type) || [])
					.filter((stream) => stream.getSource() === tributarySet.get('source'))
					.map((stream) => tributarySet.set(type, stream))
				return (expandedTributarySets.length > 0)
					? expandedTributarySets
					: [tributarySet]
			},
		),
		tributarySeeds,
	).map(
		(tributarySet) => {
			tributarySet.delete('source') // 'source' was an internal helper field
			return tributarySet
		},
	)
}

/**
 * Returns the kafka topic associated with a given stream + type pair.
 *
 * @param  {String}           dataType The data type.
 * @param  {CountertopStream} stream   The stream.
 * @return {String}                    The resulting kafka topic.
 */
export const getStreamTopic = (dataType, stream) => sanitizeTopic(`${dataType}::${stream.id}`)

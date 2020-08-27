import assert from 'assert'
import { v4 as uuid } from 'uuid'
import {
	getLongestStreamLength,
	getSourcesFromStreamMap,
} from '../tools/utils/countertop'

class CountertopStream {
	id = null

	tributaries = null

	mouth = null

	source = null

	/**
	 * Create a new CountertopStream.
	 *
	 * CountertopStreams are made up of a distinct stream of stations (e.g. Appliance instances).
	 * This allows a given countertop to have multiple sources of video data being processed
	 * simultaneously.
	 *
	 * The tributary map MUST be complete. This means that if a station takes in two types of input,
	 * there must be a tributary (input stream) for each input type.
	 *
	 * @param  {CountertopStation} station     The station at the end of the stream.
	 * @param  {Map}               tributaries The streams that are flowing into the final station.
	 */
	constructor(station, tributaries = new Map()) {
		station.getInputTypes().forEach(
			(inputType) => assert(
				tributaries.has(inputType),
				'Valid streams require one tributary per input type.',
			),
		)
		this.id = `CountertopStream::${uuid()}`
		this.mouth = station
		this.tributaries = tributaries
		if (station.getInputTypes().length === 0) {
			this.source = station
		} else {
			this.source = getSourcesFromStreamMap(tributaries).pop()
		}
	}

	/**
	 * Get the origin / first station in the stream.
	 *
	 * @return {CountertopStation} The origin station in the stream.
	 */
	getSource = () => this.source

	/**
	 * Get the last station in the stream.
	 * This is the station that will produce new data, and determines the stream's
	 * output types.
	 *
	 * @return {CountertopStation} The last station in the stream.
	 */
	getMouth = () => this.mouth

	/**
	 * Get the Map of tributary streams that feed into the mouth station.
	 *
	 * @return {Map} The map of streams keyed by the input types they feed into.
	 */
	getTributaryMap = () => this.tributaries

	/**
	 * Get an array of tributaries that feed into the mouth station.
	 *
	 * @return {CountertopStream[]} The array of tributary streams.
	 */
	getTributaryArray = () => [...this.tributaries.values()]

	/**
	 * Get the maximum length of the longest stream path between the stream's source and mouth.
	 *
	 * @return {Number} The length of the stream
	 */
	getLength = () => getLongestStreamLength(this.getTributaryArray()) + 1

	/**
	 * Checks if a given station exists at any point within the stream.
	 *
	 * @param  {CountertopStation} station The station being searched for.
	 * @return {Boolean}                   The result of the search.
	 */
	includesStation = (station) => this.mouth === station
		|| this.getTributaryArray().some((tributary) => tributary.includesStation(station))

	/**
	 * Get the output types produced by this stream.
	 *
	 * @return {String[]} The output types.
	 */
	getOutputTypes = () => this.mouth.getOutputTypes()
}

export default CountertopStream

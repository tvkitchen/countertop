import assert from 'assert'
import { v4 as uuid } from 'uuid'
import {
	getLongestStreamLength,
	getSourcesFromStreams,
} from '../tools/utils/countertop'

export class CountertopStream {
	public readonly id: string

	public readonly tributaries: Map<string, CountertopStream>

	public readonly mouth: any // this will be a CountertopStation once defined

	public readonly source: any // this will be a CountertopStation once defined

	/**
	 * Create a new CountertopStream.
	 *
	 * CountertopStreams are made up of a distinct stream of stations (e.g. Appliance instances).
	 * This allows a given Countertop to have multiple sources of video data being processed
	 * simultaneously.
	 *
	 * The tributary map does not need to be complete -- there can be inputs with no associated
	 * tributary streams.
	 *
	 * The tributary map cannot contain irrelevant streams (the output map should match the inputs).
	 *
	 * @param  {CountertopStation} station The station at the end of the stream.
	 * @param  {Map<string, CountertopStream>} tributaries The streams providing data for each input.
	 */
	constructor(
		countertopStation: any, // this will be a CountertopStation once defined
		tributaries = new Map<string, CountertopStream>(),
	) {
		Array.from(tributaries.keys()).forEach(
			(outputType) => assert(
				// TODO: remove this when CountertopStation has type definitions
				// eslint-disable-next-line
				countertopStation.getInputTypes().includes(outputType),
				'The tributaries contained an invalid stream type.',
			),
		)
		this.id = `CountertopStream::${uuid()}`
		// TODO: remove this when CountertopStation has type definitions
		// eslint-disable-next-line
		this.mouth = countertopStation
		this.tributaries = tributaries
		// TODO: remove this when CountertopStation has type definitions
		// eslint-disable-next-line
		if (countertopStation.getInputTypes().length === 0) {
			// TODO: remove this when CountertopStation has type definitions
			// eslint-disable-next-line
			this.source = countertopStation
		} else {
			// TODO: remove this when CountertopStation has type definitions
			// eslint-disable-next-line
			this.source = getSourcesFromStreams(this.getTributaryArray()).pop() ?? null
		}
	}

	/**
	 * Get an array of tributaries that feed into the mouth station.
	 *
	 * @return {CountertopStream[]} The array of tributary streams.
	 */
	public getTributaryArray(): CountertopStream[] {
		return [...this.tributaries.values()]
	}

	/**
	 * Get the maximum length of the longest stream path between the stream's source and mouth.
	 *
	 * @return {Number} The length of the stream
	 */
	public getLength() {
		return getLongestStreamLength(this.getTributaryArray()) + 1
	}

	/**
	 * Checks if a given station exists at any point within the stream.
	 *
	 * @param  {CountertopStation} station The station being searched for.
	 * @return {Boolean}                   The result of the search.
	 */
	public includesStation(station: any): boolean {
		return this.mouth === station
			|| this.getTributaryArray().some(
				// TODO: remove this when CountertopStation has type definitions
				// eslint-disable-next-line
				(tributary: any) => tributary.includesStation(station),
			)
	}

	/**
	 * Checks if a given sub-stream exists at any point within the stream.
	 */
	public includesStream(subStream: CountertopStream): boolean {
		return this.getTributaryArray().includes(subStream)
			|| this.getTributaryArray().some(
				(tributary: CountertopStream): boolean => tributary.includesStream(subStream),
			)
	}

	/**
	 * Get the output types produced by this stream.
	 *
	 * @return {String[]} The output types.
	 */
	public getOutputTypes(): any {
		// TODO: remove this when CountertopStation has type definitions
		// eslint-disable-next-line
		return this.mouth.getOutputTypes()
	}
}

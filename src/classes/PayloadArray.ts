import { ValidationError } from '../errors'
import { sortedIndexBy } from '../tools/utils/sortedArray'
import { Payload } from './Payload'
import type { PayloadType } from '../types'

export class PayloadArray {
	private readonly payloads: Payload[] = []

	public constructor(payloads: Payload[] = []) {
		payloads.forEach((payload) => this.insert(payload))
	}

	public length(): number {
		return this.payloads.length
	}

	/**
	 * Insert a Payload into the PayloadArray while maintaining position order.
	 */
	public insert(payload: Payload): this {
		if (!(payload instanceof Payload)) {
			throw new ValidationError('Invalid payload')
		}
		const index = this.indexOfPosition(payload.position)
		this.payloads.splice(
			index,
			0,
			payload,
		)
		return this
	}

	/**
	 * Remove all payloads from the PayloadArray.
	 */
	public empty(): this {
		this.payloads.length = 0
		return this
	}

	/**
	 * Find the index to which a payload with a given position would be inserted.
	 */
	public indexOfPosition(
		position: number,
		returnHighest = false,
	): number {
		return sortedIndexBy(
			this.payloads,
			position,
			(payload) => payload.position,
			returnHighest,
		)
	}

	/**
	 * Create a new PayloadArray containing only Payloads of the specified types.
	 */
	public filterByTypes(types: (PayloadType | string)[]): PayloadArray {
		const filteredPayloads = this.payloads.filter(
			(payload) => types.includes(payload.type),
		)
		return new PayloadArray(filteredPayloads)
	}

	/**
	 * Create a new PayloadArray containing only Payloads of the specified type.
	 */
	public filterByType(type: PayloadType | string): PayloadArray {
		return this.filterByTypes([type])
	}

	/**
	 * Create a new PayloadArray containing only Payloads that exist within a specified duration.
	 */
	public filterByPosition(start: number, end?: number): PayloadArray {
		const left = this.indexOfPosition(start)
		const right = end === undefined
			? this.payloads.length
			: this.indexOfPosition(end, true)
		const filteredPayloads = this.payloads.slice(left, right)
		return new PayloadArray(filteredPayloads)
	}

	/**
	 * Copy the content of the PayloadArray to a vanilla Array.
	 */
	public toArray(): Payload[] {
		return [...this.payloads]
	}

	/**
	 * Get the earliest position represented in this PayloadArray.
	 */
	public getPosition(): number {
		return this.payloads[0].position
	}

	/**
	 * Get the origin timestamp of this PayloadArray.
	 */
	public getOrigin(): string {
		return this.payloads[0].origin
	}

	/**
	 * Get the duration represented by the payloads in this PayloadArray.
	 */
	public getDuration(): number {
		const first = this.payloads[0]
		const [last] = this.payloads.slice(-1)
		return last.position - first.position + last.duration
	}
}

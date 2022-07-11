import { ValidationError } from '../../errors'
import { Payload } from '../Payload'
import { PayloadArray } from '../PayloadArray'
import type { PayloadParameters } from '../../types'

const generatePayload = (parameters: Partial<PayloadParameters> = {}): Payload => new Payload({
	data: Buffer.from(''),
	type: 'EXAMPLE',
	createdAt: '2020-02-02T03:04:05.000Z',
	origin: '2020-02-02T03:04:01.000Z',
	duration: 1000,
	position: 0,
	...parameters,
})

describe('PayloadArray', () => {
	describe('constructor', () => {
		it('should construct when provided no parameters', () => {
			const payloadArray = new PayloadArray()
			expect(payloadArray).not.toBeUndefined()
		})
		it('should construct when provided a single payload', () => {
			const payloadArray = new PayloadArray([
				generatePayload(),
			])
			expect(payloadArray.length()).toEqual(1)
		})
		it('should construct when provided multiple payloads', () => {
			const payloadArray = new PayloadArray([
				generatePayload(),
				generatePayload(),
				generatePayload(),
			])
			expect(payloadArray.length()).toEqual(3)
		})
		it('should insert in the correct order when provided multiple payloads', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 3 }),
				generatePayload({ position: 1 }),
				generatePayload({ position: 2 }),
				generatePayload({ position: 5 }),
				generatePayload({ position: 4 }),
			])
			const arr = payloadArray.toArray()
			expect(arr[0].position).toBe(1)
			expect(arr[1].position).toBe(2)
			expect(arr[2].position).toBe(3)
			expect(arr[3].position).toBe(4)
			expect(arr[4].position).toBe(5)
		})
	})

	describe('insert', () => {
		it('should insert in the correct order', () => {
			const payloadArray = new PayloadArray()
			payloadArray.insert(generatePayload({ position: 300 }))
			payloadArray.insert(generatePayload({ position: 11 }))
			payloadArray.insert(generatePayload({ position: 20 }))
			payloadArray.insert(generatePayload({ position: 5 }))
			payloadArray.insert(generatePayload({ position: 40 }))
			const arr = payloadArray.toArray()
			expect(arr[0].position).toBe(5)
			expect(arr[1].position).toBe(11)
			expect(arr[2].position).toBe(20)
			expect(arr[3].position).toBe(40)
			expect(arr[4].position).toBe(300)
		})
		it('should error when inserting an invalid payload', () => {
			const payloadArray = new PayloadArray()
			const invalidPayload = ('something silly' as unknown) as Payload
			expect(() => payloadArray.insert(invalidPayload)).toThrow(ValidationError)
		})
	})

	describe('empty', () => {
		it('should remove all elements from the PayloadArray', () => {
			const payloadArray = new PayloadArray([generatePayload()])
			payloadArray.empty()
			expect(payloadArray.toArray()).toEqual([])
		})
	})

	describe('indexOfPosition', () => {
		it('should return 0 if there are no Payloads', () => {
			const payloadArray = new PayloadArray()
			expect(payloadArray.indexOfPosition(500)).toBe(0)
			expect(payloadArray.indexOfPosition(0)).toBe(0)
			expect(payloadArray.indexOfPosition(1)).toBe(0)
		})
		it('should return 0 if there are no Payloads with an earlier position', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 1000 }),
			])
			expect(payloadArray.indexOfPosition(500)).toBe(0)
			expect(payloadArray.indexOfPosition(0)).toBe(0)
			expect(payloadArray.indexOfPosition(1)).toBe(0)
		})
		it('should return 1 if there is a single Payload with an earlier position', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 1000 }),
			])
			expect(payloadArray.indexOfPosition(5000)).toBe(1)
			expect(payloadArray.indexOfPosition(1001)).toBe(1)
		})
		it('should return the index of the first payload with the passed position', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 1000 }),
			])
			expect(payloadArray.indexOfPosition(1000)).toBe(0)
		})
		it('should return the index of the first payload with the passed position', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 500 }),
				generatePayload({ position: 1000 }),
			])
			expect(payloadArray.indexOfPosition(1000)).toBe(1)
		})
	})

	describe('filterByType', () => {
		it('should return a PayloadArray whose payloads match the specified type', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ type: 'TEXT.WORD' }),
				generatePayload({ type: 'TEXT.WORD' }),
				generatePayload({ type: 'TEXT.ATOM' }),
			])
			const filteredPayloadArray = payloadArray.filterByType('TEXT.WORD')
			expect(filteredPayloadArray).toBeInstanceOf(PayloadArray)
			expect(filteredPayloadArray.length()).toBe(2)
		})
	})

	describe('filterByTypes', () => {
		it('should return a PayloadArray whose payloads match the specified type', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ type: 'TEXT.WORD' }),
				generatePayload({ type: 'TEXT.WORD' }),
				generatePayload({ type: 'TEXT.ATOM' }),
				generatePayload({ type: 'TEXT.ASPARAGUS' }),
			])
			const filteredPayloadArray = payloadArray.filterByTypes([
				'TEXT.WORD',
				'TEXT.ATOM',
			])
			expect(filteredPayloadArray).toBeInstanceOf(PayloadArray)
			expect(filteredPayloadArray.length()).toBe(3)
		})
	})

	describe('filterByPosition', () => {
		it('should return a PayloadArray whose payloads exist within the specified time range', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 0 }),
				generatePayload({ position: 1000 }),
				generatePayload({ position: 2000 }),
			])
			const filteredPayloadArray = payloadArray.filterByPosition(0, 1000)
			expect(filteredPayloadArray).toBeInstanceOf(PayloadArray)
			expect(filteredPayloadArray.length()).toBe(2)
		})
		it('should return a PayloadArray whose payloads exist within the specified time range', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 0 }),
				generatePayload({ position: 1000 }),
				generatePayload({ position: 2000 }),
			])
			const filteredPayloadArray = payloadArray.filterByPosition(0, 1500)
			expect(filteredPayloadArray).toBeInstanceOf(PayloadArray)
			expect(filteredPayloadArray.length()).toBe(2)
		})
		it('should return a PayloadArray whose payloads exist after the specified time', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 0 }),
				generatePayload({ position: 1000 }),
				generatePayload({ position: 2000 }),
			])
			const filteredPayloadArray = payloadArray.filterByPosition(1000)
			expect(filteredPayloadArray).toBeInstanceOf(PayloadArray)
			expect(filteredPayloadArray.length()).toBe(2)
		})
	})

	describe('toArray', () => {
		it('should return an array when passed nothing', () => {
			const payloadArray = new PayloadArray()
			expect(payloadArray.toArray()).toBeInstanceOf(Array)
		})
		it('should not return a reference to the array contained by the PayloadArray', () => {
			const payloadArray = new PayloadArray()
			payloadArray.toArray().push(
				generatePayload(),
			)
			expect(payloadArray.toArray()).toEqual([])
		})
	})

	describe('getPosition', () => {
		it('should return the position of the earliest payload', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 2000 }),
				generatePayload({ position: 1000 }),
			])
			expect(payloadArray.getPosition()).toBe(1000)
		})
	})

	describe('getOrigin', () => {
		it('should return the origin of the earliest payload', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ origin: '2021-03-15T04:05:12.634Z' }),
			])
			expect(payloadArray.getOrigin()).toBe('2021-03-15T04:05:12.634Z')
		})
	})

	describe('getDuration', () => {
		it('should return the full duration of all payloads', () => {
			const payloadArray = new PayloadArray([
				generatePayload({ position: 4000, duration: 5 }),
				generatePayload({ position: 6000, duration: 3 }),
			])
			expect(payloadArray.getDuration()).toBe(2003)
		})
	})
})

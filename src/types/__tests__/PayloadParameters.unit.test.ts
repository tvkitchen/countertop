import { isPayloadParameters } from '../PayloadParameters'

describe('isPayloadParameters', () => {
	it('should return true for valid payload parameters', () => {
		expect(isPayloadParameters({
			data: Buffer.from('I ate all of the cheese'),
			type: 'CONFESSION',
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: 60000,
		})).toEqual(true)
	})
	it('should return true with no createdAt parameter', () => {
		expect(isPayloadParameters({
			data: Buffer.from('I ate all of the cheese'),
			type: 'CONFESSION',
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: 60000,
		})).toEqual(true)
	})
	it('should return false for incomplete payload parameters', () => {
		expect(isPayloadParameters({
			type: 'CONFESSION',
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: 60000,
		})).toEqual(false)
	})
	it('should return false for incorrectly typed payload parameters', () => {
		expect(isPayloadParameters({
			data: 'this is not a buffer',
			type: 'CONFESSION',
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: 60000,
		})).toEqual(false)
		expect(isPayloadParameters({
			data: {
				field: 'this is an object, but not a buffer.',
			},
			type: 'CONFESSION',
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: 60000,
		})).toEqual(false)
		expect(isPayloadParameters({
			data: Buffer.from('I ate all of the cheese'),
			type: 42,
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: 60000,
		})).toEqual(false)
		expect(isPayloadParameters({
			data: Buffer.from('I ate all of the cheese'),
			type: 'CONFESSION',
			createdAt: 0,
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: 60000,
		})).toEqual(false)
		expect(isPayloadParameters({
			data: Buffer.from('I ate all of the cheese'),
			type: 'CONFESSION',
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: 0,
			duration: 1000,
			position: 60000,
		})).toEqual(false)
		expect(isPayloadParameters({
			data: Buffer.from('I ate all of the cheese'),
			type: 'CONFESSION',
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: '2020-02-02T03:04:01.000Z',
			duration: '1000',
			position: 60000,
		})).toEqual(false)
		expect(isPayloadParameters({
			data: Buffer.from('I ate all of the cheese'),
			type: 'CONFESSION',
			createdAt: '2020-02-02T03:04:05.000Z',
			origin: '2020-02-02T03:04:01.000Z',
			duration: 1000,
			position: '60000',
		})).toEqual(false)
	})
})

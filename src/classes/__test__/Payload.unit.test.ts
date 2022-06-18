import { Payload } from '../Payload'

describe('Payload', () => {
	describe('constructor', () => {
		it('should construct when provided all parameters', () => {
			const parameters = {
				data: Buffer.from('I ate all of the cheese'),
				type: 'CONFESSION',
				createdAt: '2020-02-02T03:04:05.000Z',
				origin: '2020-02-02T03:04:01.000Z',
				duration: 1000,
				position: 60000,
			}
			const payload = new Payload(parameters)
			expect(payload).not.toBeUndefined()
			expect(payload.data.toString()).toBe('I ate all of the cheese')
			expect(payload.type).toBe('CONFESSION')
			expect(payload.createdAt).toEqual('2020-02-02T03:04:05.000Z')
			expect(payload.origin).toEqual('2020-02-02T03:04:01.000Z')
			expect(payload.duration).toBe(1000)
			expect(payload.position).toBe(60000)
		})
		it('should populate a default createdAt', () => {
			const parameters = {
				data: Buffer.from('I ate all of the cheese'),
				type: 'CONFESSION',
				origin: '2020-02-02T03:04:01.000Z',
				duration: 1000,
				position: 60000,
			}
			const payload = new Payload(parameters)
			expect(payload.createdAt).not.toBe('')
		})
		it('should set createdAt differently for payloads created at different times', () => {
			jest.clearAllMocks()
			const parameters = {
				data: Buffer.from('I ate all of the cheese'),
				type: 'CONFESSION',
				origin: '2020-02-02T03:04:01.000Z',
				duration: 1000,
				position: 60000,
			}
			jest.setSystemTime(new Date('1592156234000'))
			const firstPayload = new Payload(parameters)
			jest.setSystemTime(new Date('1592156235000'))
			const secondPayload = new Payload(parameters)
			expect(firstPayload.createdAt).not.toEqual(secondPayload.createdAt)
		})
	})

	describe('serialize', () => {
		it('should properly should serialize data with a fully populated object', () => {
			const parameters = {
				data: Buffer.from('I ate all of the cheese'),
				type: 'CONFESSION',
				createdAt: '2020-02-02T03:04:05.000Z',
				origin: '2020-02-02T03:04:01.000Z',
				duration: 1000,
				position: 60000,
			}
			const payload = new Payload(parameters)
			const serializedPayload = Payload.serialize(payload)
			expect(serializedPayload).toMatchSnapshot()
		})
	})

	describe('deserialize', () => {
		it('should error when deserializing an empty serialized object', () => {
			expect(() => Payload.deserialize('{}')).toThrow()
		})
		it('should error when deserializeing a partially populated serialized payload', () => {
			expect(() => Payload.deserialize('{"type":"WHOOPS"}')).toThrow()
		})
		it('should properly deserialize a serialized payload', () => {
			const parameters = {
				data: Buffer.from('I ate all of the cheese'),
				type: 'CONFESSION',
				createdAt: '2020-02-02T03:04:05.000Z',
				origin: '2020-02-02T03:04:01.000Z',
				duration: 1000,
				position: 60000,
			}
			const payload = new Payload(parameters)
			const serializedPayload = Payload.serialize(payload)
			const deserializedPayload = Payload.deserialize(serializedPayload)
			expect(deserializedPayload).toEqual(payload)
		})
		it('should error when deserializing serialized objects with invalid values', () => {
			const parameters = {
				data: 'this is not a buffer',
				type: 'CONFESSION',
				createdAt: '2020-02-02T03:04:05.000Z',
				origin: '2020-02-02T03:04:01.000Z',
				duration: 1000,
				position: 60000,
			}
			const serializedValues = JSON.stringify(parameters)
			expect(() => Payload.deserialize(serializedValues)).toThrow()
		})
	})
})

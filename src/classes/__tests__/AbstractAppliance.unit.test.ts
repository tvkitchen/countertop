import {
	AbstractImplementationError,
	ProcessingError,
	ValidationError,
} from '../../errors'
import { Payload } from '../Payload'
import { PayloadArray } from '../PayloadArray'
import { generateMockAppliance } from '../../tools/test'
import type { AbstractAppliance } from '../AbstractAppliance'

describe('AbstractAppliance', () => {
	describe('constructor', () => {
		it('should throw an error if a derived class does not define inputTypes', () => {
			const MockAppliance = generateMockAppliance({
				outputTypes: [],
			})
			expect(() => {
				// The failed construction is the point of this test, so we have to allow it
				// eslint-disable-next-line no-new
				new MockAppliance()
			}).toThrow(AbstractImplementationError)
		})

		it('should throw an error if a derived class does not define outputTypes', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
			})
			expect(() => {
				// The failed construction is the point of this test, so we have to allow it
				// eslint-disable-next-line no-new
				new MockAppliance()
			}).toThrow(AbstractImplementationError)
		})

		it('should not throw an error if inputTypes and outputTypes are defined', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
			})
			expect(() => new MockAppliance()).not.toThrow()
		})
	})

	describe('write', () => {
		it('should use invoke to transform ingested payloads', (done) => {
			const inputPayload = new Payload({
				data: Buffer.from('hello world'),
				type: 'EXAMPLE',
				duration: 1,
				position: 0,
			})
			const outputPayload = new Payload({
				data: Buffer.from('goodbye world'),
				type: 'EXAMPLE',
				duration: 1,
				position: 0,
			})

			let appliance: AbstractAppliance
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
				invoke: async (payloadArray: PayloadArray) => {
					expect(payloadArray.toArray()[0]).toBe(inputPayload)
					appliance.push(outputPayload)
					return new PayloadArray()
				},
			})

			appliance = new MockAppliance()
			appliance.on('data', (transformedPayload: Payload) => {
				expect(transformedPayload).toEqual(outputPayload)
			})

			expect.assertions(2)
			appliance.write(inputPayload, undefined, () => {
				done()
			})
		})

		it('should use the origin of the payload when provided', (done) => {
			const inputPayload = new Payload({
				data: Buffer.from('hello world'),
				type: 'EXAMPLE',
				origin: '2023-07-24T03:44:00.209Z',
				duration: 1,
				position: 0,
			})
			const outputPayload = new Payload({
				data: Buffer.from('goodbye world'),
				type: 'EXAMPLE',
				origin: '2023-07-24T03:44:00.209Z',
				duration: 1,
				position: 0,
			})
			let appliance: AbstractAppliance
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
				invoke: async (payloadArray: PayloadArray) => {
					expect(payloadArray.toArray()[0]).toBe(inputPayload)
					appliance.push(outputPayload)
					return new PayloadArray()
				},
			})

			appliance = new MockAppliance()
			appliance.on('data', (transformedPayload: Payload) => {
				expect(transformedPayload).toEqual(outputPayload)
			})

			expect.assertions(2)
			appliance.write(inputPayload, undefined, () => {
				done()
			})
		})

		it('should error if invoke throws an error', (done) => {
			let eventsCompleted = 0
			const registerEvent = () => {
				eventsCompleted += 1
				if (eventsCompleted === 2) {
					done()
				}
			}
			const inputPayload = new Payload({
				data: Buffer.from('hello world'),
				type: 'EXAMPLE',
				duration: 1,
				position: 0,
			})
			const invokeError = new Error('test error')
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
				invoke: async () => {
					throw invokeError
				},
			})

			const appliance = new MockAppliance()
			appliance.on('error', (error) => {
				expect(error).toBe(invokeError)
				registerEvent()
			})

			expect.assertions(2)
			appliance.write(inputPayload, undefined, (error) => {
				expect(error).toBe(invokeError)
				registerEvent()
			})
		})

		it('should error if invoke throws a non-error', (done) => {
			let eventsCompleted = 0
			const registerEvent = () => {
				eventsCompleted += 1
				if (eventsCompleted === 2) {
					done()
				}
			}
			const inputPayload = new Payload({
				data: Buffer.from('hello world'),
				type: 'EXAMPLE',
				duration: 1,
				position: 0,
			})
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
				invoke: async () => {
					// Throwing a non-error is actually what is being tested here
					// eslint-disable-next-line @typescript-eslint/no-throw-literal
					throw 42
				},
			})

			const appliance = new MockAppliance()
			appliance.on('error', (error) => {
				expect(error).toBeInstanceOf(ProcessingError)
				registerEvent()
			})

			expect.assertions(2)
			appliance.write(inputPayload, undefined, (error) => {
				expect(error).toBeInstanceOf(ProcessingError)
				registerEvent()
			})
		})

		it('should throw a validation error if an invalid payload is passed', (done) => {
			let eventsCompleted = 0
			const registerEvent = () => {
				eventsCompleted += 1
				if (eventsCompleted === 2) {
					done()
				}
			}
			const inputPayload = new Payload({
				data: Buffer.from('hello world'),
				type: 'EXAMPLE',
				duration: 1,
				position: 0,
			})
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
				outputTypes: [],
				checkPayload: async () => false,
			})

			const appliance = new MockAppliance()
			appliance.on('error', (error) => {
				expect(error).toBeInstanceOf(ValidationError)
				registerEvent()
			})

			expect.assertions(2)
			appliance.write(inputPayload, undefined, (error) => {
				expect(error).toBeInstanceOf(ValidationError)
				registerEvent()
			})
		})
	})

	describe('getInputTypes', () => {
		it('should return the input types associated with the derived class', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [
					'inputFoo1',
					'inputFoo2',
				],
				outputTypes: [],
			})
			expect(MockAppliance.getInputTypes()).toEqual([
				'inputFoo1',
				'inputFoo2',
			])
		})
		it('should recognize input type overrides', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [
					'inputFoo1',
					'inputFoo2',
				],
				outputTypes: [],
			})
			expect(MockAppliance.getInputTypes({
				inputTypeFilter: [
					'inputFoo2',
					'notAValidType',
				],
			})).toEqual([
				'inputFoo2',
			])
		})
		it('should throw an error if inputTypes has not been defined', () => {
			const MockAppliance = generateMockAppliance({
				outputTypes: [],
			})
			expect(() => MockAppliance.getInputTypes()).toThrow(AbstractImplementationError)
		})
	})

	describe('getOutputTypes', () => {
		it('should return the output types associated with the derived class', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [
				],
				outputTypes: [
					'outputFoo1',
					'outputFoo2',
				],
			})
			expect(MockAppliance.getOutputTypes()).toEqual([
				'outputFoo1',
				'outputFoo2',
			])
		})
		it('should recognize output type overrides', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [
				],
				outputTypes: [
					'outputFoo1',
					'outputFoo2',
				],
			})
			expect(MockAppliance.getOutputTypes({
				outputTypeFilter: [
					'outputFoo2',
					'notAValidType',
				],
			})).toEqual([
				'outputFoo2',
			])
		})
		it('should throw an error if outputTypes has not been defined', () => {
			const MockAppliance = generateMockAppliance({
				inputTypes: [],
			})
			expect(() => MockAppliance.getOutputTypes()).toThrow(AbstractImplementationError)
		})
	})
})

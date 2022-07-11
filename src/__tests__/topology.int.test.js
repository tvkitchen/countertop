import { dataTypes } from '@tvkitchen/base-constants'
import { Countertop } from '..'
import {
	generateMockAppliance,
	normalizeStreams,
} from '../tools/utils/jest'

jest.mock('kafkajs')

describe('Countertop #integration', () => {
	describe('updateTopology', () => {
		it('Should generate correct simple linear topologies', async () => {
			const countertop = new Countertop()
			const sourceAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const captionAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: [dataTypes.TEXT.ATOM],
			}))
			const topology = await countertop.updateTopology()
			const stations = [
				sourceAppliance,
				captionAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with multiple sources', async () => {
			const countertop = new Countertop()
			const sourceApplianceA = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const sourceApplianceB = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const captionAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: [dataTypes.TEXT.ATOM],
			}))
			const topology = await countertop.updateTopology()
			const stations = [
				sourceApplianceA,
				sourceApplianceB,
				captionAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with dual inputs', async () => {
			const countertop = new Countertop()
			const sourceAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const captionAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: [dataTypes.TEXT.ATOM],
			}))
			const imageAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: ['IMAGE.JPEG'],
			}))
			const complexInputAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.TEXT.ATOM, 'IMAGE.JPEG'],
				outputTypes: ['IMAGE.GIF'],
			}))
			const topology = await countertop.updateTopology()
			const stations = [
				sourceAppliance,
				captionAppliance,
				imageAppliance,
				complexInputAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with dual output appliances', async () => {
			const countertop = new Countertop()
			const sourceAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const complexOutputAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: [dataTypes.TEXT.ATOM, 'IMAGE.JPEG'],
			}))
			const topology = await countertop.updateTopology()
			const stations = [
				sourceAppliance,
				complexOutputAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with dual outputs', async () => {
			const countertop = new Countertop()
			const sourceAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const complexOutputAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: [dataTypes.TEXT.ATOM, 'IMAGE.JPEG'],
			}))
			const ocrAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: ['IMAGE.JPEG'],
				outputTypes: [dataTypes.TEXT.ATOM],
			}))
			const sentenceAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.TEXT.ATOM],
				outputTypes: [dataTypes.TEXT.SENTENCE],
			}))
			const topology = await countertop.updateTopology()
			const stations = [
				sourceAppliance,
				complexOutputAppliance,
				ocrAppliance,
				sentenceAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})
	})
})

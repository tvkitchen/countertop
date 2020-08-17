import { dataTypes } from '@tvkitchen/base-constants'
import CountertopCoordinator from '%src/components/countertop/CountertopCoordinator'
import {
	generateMockAppliance,
	normalizeStreams,
} from '%src/tools/utils/jest'

describe('CountertopCoordinator', () => {
	describe('updateTopology', () => {
		it('Should generate correct simple linear topologies', () => {
			const countertop = new CountertopCoordinator()
			const sourceAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const captionAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: [dataTypes.TEXT.ATOM],
			}))
			const topology = countertop.updateTopology()
			const stations = [
				sourceAppliance,
				captionAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with multiple sources', () => {
			const countertop = new CountertopCoordinator()
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
			const topology = countertop.updateTopology()
			const stations = [
				sourceApplianceA,
				sourceApplianceB,
				captionAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with dual inputs', () => {
			const countertop = new CountertopCoordinator()
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
			const topology = countertop.updateTopology()
			const stations = [
				sourceAppliance,
				captionAppliance,
				imageAppliance,
				complexInputAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with dual output appliances', () => {
			const countertop = new CountertopCoordinator()
			const sourceAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [],
				outputTypes: [dataTypes.STREAM.CONTAINER],
			}))
			const complexOutputAppliance = countertop.addAppliance(generateMockAppliance({
				inputTypes: [dataTypes.STREAM.CONTAINER],
				outputTypes: [dataTypes.TEXT.ATOM, 'IMAGE.JPEG'],
			}))
			const topology = countertop.updateTopology()
			const stations = [
				sourceAppliance,
				complexOutputAppliance,
			]
			expect(normalizeStreams(topology.streams, stations)).toMatchSnapshot()
		})

		it('Should generate correct topologies with dual outputs', () => {
			const countertop = new CountertopCoordinator()
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
			const topology = countertop.updateTopology()
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

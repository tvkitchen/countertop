import {
	tsToMilliseconds,
	generateEmptyPacket,
} from '../mpegts'

describe('mpegts utilities', () => {
	describe('tsToMilliseconds()', () => {
		it('should convert successfuly with the default basetime', () => {
			expect(tsToMilliseconds(90000)).toBe(1000)
		})
		it('should convert successfuly with an override basetime', () => {
			expect(tsToMilliseconds(500, 200)).toBe(2500)
		})
	})

	describe('generateEmptyPacket', () => {
		it('should have zeroed-out attributes of a TSDemuxer Packet', () => {
			const emptyPacket = generateEmptyPacket()
			expect(emptyPacket).toMatchObject({
				data: [],
				pts: 0,
				dts: 0,
				frame_ticks: 0,
				program: 0,
				stream_number: 0,
				type: 0,
				stream_id: 0,
				content_type: 0,
				frame_num: 0,
			})
		})
	})
})

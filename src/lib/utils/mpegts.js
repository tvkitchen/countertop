/* eslint-disable import/prefer-default-export */

/**
 * Converts a pts or dts extracted from an MPEG-TS packet to seconds.
 *
 * @param  {Number} ts       The pts or dts value to be converted.
 * @param  {Number} baseTime The MPEG-TS basetime associated with the ts.
 * @return {Number}          The number of seconds represented by the pts or dts.
 */
export const tsToMilliseconds = (ts, baseTime = 90000) => +((ts / baseTime) * 1000).toFixed(0)

/**
 * Exports a TSDemuxer MPEG-TS Packet as defined in the TSDemuxer project.
 *
 * @return {Object} A TSDemuxer Packet with no data
 */
export const generateEmptyPacket = () => ({
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

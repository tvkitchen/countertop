/* eslint-disable import/prefer-default-export */

/**
 * Correct a kafka topic string so it meets the documented conditions for kafka topics.
 *
 * This will replace any invalid character with a '-'
 * This will truncate any string longer than 255 characters.
 *
 * @param  {String} topic The topic string to be sanitized.
 * @return {String}       The sanitized topic string.
 */
export const sanitizeTopic = (topic) => topic
	.replace(
		/[^a-zA-Z0-9\\._\\-]/g,
		'-',
	)
	.substring(0, 255)

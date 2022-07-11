import {
	sanitizeTopic,
} from '../kafka'

describe('kafka #unit', () => {
	describe('sanitizeTopic', () => {
		it('Should not change valid topics', () => {
			expect(sanitizeTopic('works')).toBe('works')
			expect(sanitizeTopic('works.also')).toBe('works.also')
			expect(sanitizeTopic('works123')).toBe('works123')
		})
		it('Should replace invalid characters with `-`', () => {
			expect(sanitizeTopic('works!')).toBe('works-')
		})
		it('Should truncate long strings', () => {
			const longString = '1234567890123456789012345678901234567890123456789012345678901234567890' // 70 characters
			+ '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' // 90 characters
			+ '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' // 90 characters
			+ '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' // 90 characters
			const shortString = '1234567890123456789012345678901234567890123456789012345678901234567890' // 70 characters
			+ '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' // 90 characters
			+ '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' // 90 characters
			+ '12345' // 5 characters
			expect(sanitizeTopic(longString)).toBe(shortString)
		})
	})
})

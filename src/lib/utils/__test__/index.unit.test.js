import {
	methodExists,
} from '%src/lib/utils'

describe('index', () => {
	describe('methodExists', () => {
		it('should return false if the method does not exist', () => {
			const x = {}
			expect(methodExists('foo', x)).toBe(false)
		})
		it('should return false if the attribute is not a method', () => {
			const x = {
				foo: 'bar',
			}
			expect(methodExists('foo', x)).toBe(false)
		})
		it('should return true if the method does exist', () => {
			const x = {
				foo: () => 'bar',
			}
			expect(methodExists('foo', x)).toBe(true)
		})
	})
})

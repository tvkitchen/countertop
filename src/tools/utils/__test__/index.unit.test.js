import {
	methodExists,
	arraysHaveOverlap,
	by,
} from '%src/tools/utils'

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

	describe('arraysHaveOverlap', () => {
		it('should return false if they share no common elements', () => {
			expect(arraysHaveOverlap(
				[1, 2, 3],
				[4, 5],
			)).toBe(false)
			expect(arraysHaveOverlap(
				[],
				[4, 5],
			)).toBe(false)
		})
		it('should return true if they share common elements', () => {
			expect(arraysHaveOverlap(
				[1, 2, 3],
				[4, 5, 1],
			)).toBe(true)
		})
	})

	describe('by', () => {
		it('should return a function that sorts correctly', () => {
			const fn = by('id')
			expect(fn({ id: 1 }, { id: 2 })).toBe(-1)
			expect(fn({ id: 2 }, { id: 1 })).toBe(1)
		})
	})
})

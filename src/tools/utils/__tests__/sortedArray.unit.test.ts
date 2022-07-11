import { sortedIndexBy } from '../sortedArray'

describe('sortedIndexBy', () => {
	it('should return the first index greater than or equal to the passed value', () => {
		expect(sortedIndexBy([1, 2, 3, 4, 5], 3, (x) => x)).toBe(2)
		expect(sortedIndexBy([1, 2, 4, 5, 6], 3, (x) => x)).toBe(2)
		expect(sortedIndexBy([1, 2, 4, 5, 6], 14, (x) => x)).toBe(5)
		expect(sortedIndexBy([1, 2, 4, 5, 5, 5, 6], 5, (x) => x)).toBe(3)
		expect(sortedIndexBy([1, 2, 4, 5, 5, 5, 6], 5, (x) => x, true)).toBe(6)
		expect(sortedIndexBy(
			[{ v: 1 }, { v: 2 }, { v: 4 }, { v: 5 }, { v: 6 }],
			14,
			(x) => x.v,
		)).toBe(5)
		expect(sortedIndexBy(
			[{ v: 1 }, { v: 2 }, { v: 4 }, { v: 5 }, { v: 6 }],
			1,
			(x) => x.v,
		)).toBe(0)
	})
})

import {
	expandRangeOfIntegers,
	generateIntegersBetween,
	splitRangeToIntegers,
	uniqueArray,
} from '..'

describe('utils/index', () => {
	describe('expandRangeOfIntegers', () => {
		const expectedRange = [1, 2, 3, 4, 5, 6]
		it('Should expand known range examples to an array of integers', () => {
			expect(expandRangeOfIntegers('1')).toEqual([1])
			expect(expandRangeOfIntegers('1-1')).toEqual([1])
			expect(expandRangeOfIntegers('1,2,3,4,5,6')).toEqual(expectedRange)
			expect(expandRangeOfIntegers('1-6')).toEqual(expectedRange)
			expect(expandRangeOfIntegers('1-3,4-6')).toEqual(expectedRange)
			expect(expandRangeOfIntegers('1-3,4-6')).toEqual(expectedRange)
			expect(expandRangeOfIntegers('1-3,4,5-6')).toEqual(expectedRange)
		})
		it('Should exclude duplicates', () => {
			expect(expandRangeOfIntegers('1-6,1-6')).toEqual(expectedRange)
		})
	})
	describe('generateIntegersBetween', () => {
		it('Should generate integers between two integers', () => {
			expect(generateIntegersBetween(0, 2)).toEqual([0, 1, 2])
			expect(generateIntegersBetween(2, 0)).toEqual([2, 1, 0])
			expect(generateIntegersBetween(-1, 1)).toEqual([-1, 0, 1])
			expect(generateIntegersBetween(1, -1)).toEqual([1, 0, -1])
		})
		it('Should respect the `inclusive` option', () => {
			expect(generateIntegersBetween(0, 2, { inclusive: false })).toEqual([1])
		})
		it('Should return an empty array if passed any non-integer arguments', () => {
			expect(generateIntegersBetween('0', '2')).toEqual([])
			expect(generateIntegersBetween(0, '2')).toEqual([])
			expect(generateIntegersBetween('0', 2)).toEqual([])
			expect(generateIntegersBetween('0')).toEqual([])
			expect(generateIntegersBetween(0)).toEqual([])
			expect(generateIntegersBetween()).toEqual([])
		})
		it('Should return a single-item array if passed equal arguments', () => {
			expect(generateIntegersBetween(2, 2)).toEqual([2])
		})
		it('Should return an empty array if passed equal arguments with `inclusive: false`', () => {
			expect(generateIntegersBetween(2, 2, { inclusive: false })).toEqual([])
		})
	})
	describe('splitRangeToIntegers', () => {
		it('Should split expected ranges to arrays of integers', () => {
			expect(splitRangeToIntegers('1-3')).toEqual([1, 3])
			expect(splitRangeToIntegers('3-1')).toEqual([3, 1])
			expect(splitRangeToIntegers('1')).toEqual([1])
		})
		it('Should choke on badly-formatted arguments', () => {
			// TODO: It'd be nice if we'd throw errors or otherwise usefully choke on weird input,
			//       like `'1-3-6'` or `'hi-mom'`.
		})
	})
	describe('uniqueArray', () => {
		it('Should reduce an array to only its unique items', () => {
			expect(uniqueArray([1, 1, 2])).toEqual([1, 2])
			expect(uniqueArray([1, '1', 2])).toEqual([1, '1', 2])
			expect(uniqueArray([1, 2])).toEqual([1, 2])
			expect(uniqueArray([1])).toEqual([1])
			expect(uniqueArray([])).toEqual([])
		})
	})
})

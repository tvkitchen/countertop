// ------------------------------------------------------------------------------------------------
// NB: There are several places in this file that we'd like to use the logger, but unfortunately,
// importing it creates a cyclical dependency (since this file is imported by config.js which is
// imported by logger.js). I've indicated places below where we would like to log, if we ever sort
// out how to safely do so.
// ------------------------------------------------------------------------------------------------

// Given an array of items, returns a new array with only the unique items.
//
// TODO: This could have quite a bit more safety and error-checking built in.
export const uniqueArray = (array) => [...new Set(array)]

// Given two integers, generates all the integers in between.
//
// By default, will include the original two boundary integers. To exclude them, set
// `inclusive: false` in the third (options) argument.
//
// This function does not do type coercion, so boundary arguments must be integers.
export const generateIntegersBetween = (a, b, { inclusive = true } = {}) => {
	// Bail out early if we weren't passed integers
	if (!Number.isInteger(a) || !Number.isInteger(b)) {
		// TODO: Enable the next line if logger-importing is solved:
		// logger.warn('generateIntegersBetween() requires the first two arguments to be integers.')
		return []
	}

	// Bail out early if they're the same number
	if (a === b) {
		return inclusive ? [a] : []
	}

	// Fill that range up! (NB: This is written for clarity, not succinctness.)
	const range = []
	if (inclusive) {
		range.push(a)
	}
	if (a < b) {
		// Ordered lowest to highest
		let current = a + 1
		while (current < b) {
			range.push(current)
			current += 1
		}
	} else {
		// Ordered highest to lowest
		let current = a - 1
		while (current > b) {
			range.push(current)
			current -= 1
		}
	}
	if (inclusive) {
		range.push(b)
	}

	return range
}

// Takes a string range like `"1-4"` and returns an array of boundary integers: `[1,4]`.
//
// If the string contains just a single number (no range), it will return a single-integer array.
//
// Strings containing multiple ranges, e.g. `"1-4-3"`, are officially unsupported, but it tries to
// recover from it by returning the first and last elements of the range. (It does not use min/max
// cleverness to pluck out the highest and lowest numbers in the string, because we support
// reverse-order ranges such as `"6-1"`, and determining order intent from multiple-range strings
// isn't compatible with this.)
//
// Examples:
// - `"1"`   => `[1]`
// - `"1-3"` => `[1,3]`
// - `"3-1"` => `[3,1]`
// - `"1-3-5"` => `[1,5]` // Don't do this!
//
// This method is not broadly useful, but it's still exported so we can test it.
export const splitRangeToIntegers = (range) => {
	let array = []
	if (range.includes('-')) {
		const splitRange = range.split('-')
		// TODO: Enable the next block if logger-importing is solved:
		// if (splitRange.length > 2) {
		// 	logger.warn(`splitRangeToIntegers() was passed a multiple-range string. The result may
		// 							be unexpected.`)
		// }
		array = [splitRange[0], splitRange.pop()]
	} else {
		array = [range]
	}
	return array.map((i) => parseInt(i, 10))
}

// Converts an integer range shorthand syntax to an array of unique integers.
//
// It receives a string like `"1-5,10-15,19"` and returns all the integers we think that range
// intends to describe. In that case: `[1,2,3,4,5,10,11,12,13,14,15,19]`.
export const expandRangeOfIntegers = (rangeShorthand) => {
	let expandedRange = []
	rangeShorthand.split(',').forEach((segment) => {
		let splitSegments = splitRangeToIntegers(segment)
		if (splitSegments.length === 2) {
			splitSegments = generateIntegersBetween(splitSegments[0], splitSegments[1])
		}
		expandedRange = expandedRange.concat(splitSegments)
	})
	return uniqueArray(expandedRange)
}

/**
 * Find the index within a sorted array to which a given value could be inserted while
 * still maintaining order.
 *
 * This takes in a function that will be called on array items in order to parse the sorted
 * value.
 */
export const sortedIndexBy = <I, V>(
	sortedArray: I[],
	value: V,
	valueGetter: (x: I) => V,
	returnHighest = false,
): number => {
	let low = 0
	let high = sortedArray.length
	while (low < high) {
		const mid = Math.floor((low + high) / 2)
		const computed = valueGetter(sortedArray[mid])
		if (computed < value) {
			low = mid + 1
		} else if (computed === value
			&& returnHighest) {
			low = mid + 1
		} else {
			high = mid
		}
	}
	return Math.min(high, sortedArray.length)
}

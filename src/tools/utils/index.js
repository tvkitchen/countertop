// Disabling because we intend to have more exports in the future.
/* eslint-disable import/prefer-default-export */

/**
 * Checks whether a method exists in a given object.
 *
 * @param  {String} methodName The name of the method being checked
 * @param  {Object} object     The object in which the method should exist
 * @return {Boolean}           Whether the method is defined and is a function
 */
export const methodExists = (methodName, object) => typeof object[methodName] === 'function'

/**
 * Checks whether two arrays share any items
 * @param  {Array} arr1 The first array being considered.
 * @param  {Array} arr2 The second array being considered.
 * @return {Boolean}    Whether the two arrays share any items.
 */
export const arraysHaveOverlap = (arr1, arr2) => arr1.some(
	(item) => arr2.includes(item),
)

/**
 * Generates a method that can be used to sort a list of objects by
 * the specified attribute.
 * @param  {String}   attribute The attribute to use for the sort.
 * @return {Function}           The sort comparison function.
 */
export const by = (attribute) => (a, b) => ((a[attribute] > b[attribute]) ? 1 : -1)

export * from './sortedArray'

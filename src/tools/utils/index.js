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

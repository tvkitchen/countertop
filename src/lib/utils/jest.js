// Disabling because we intend to have more exports in the future.
/* eslint-disable import/prefer-default-export */
import fs from 'fs'
import path from 'path'

/**
 * Loads a file containing JSON from the test's `data` directory and returns the resulting object.
 *
 * @param  {String} fileName The name of the file located in the `data` directory
 */
export const loadTestData = (testDirectory, fileName) => JSON.parse(fs.readFileSync(
	path.join(testDirectory, 'data', fileName),
))

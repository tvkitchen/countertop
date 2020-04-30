/**
 * Require our actual `package.json` data for use by this file.
 *
 * (NB: `package` is a reserved word.)
 */
const packageData = require('../../package.json')

/**
 * Extracts the `module-alias` configuration settings from our `package.json` data.
 *
 * Since this will be in a syntax specific to the `module-alias` package, this data will almost
 * certainly have to be transformed for use by other packages/tools.
 *
 * @returns {Object} The `module-alias` configuration, with alias as key and destination as value,
 *                   or an empty object.
 */
// We don't control the `_moduleAliases` variable name, we just work with it.
// eslint-disable-next-line no-underscore-dangle
const getModuleAliasesFromPackage = () => packageData._moduleAliases || {}

/**
 * Loads aliases from `package.json` data and transforms them into ESLint's configuration format:
 * `[[alias, destination]]`
 *
 * @returns {Array[]} An array of arrays, where each inner array is an alias/destination mapping
 *                    with the alias in the first position and the destination in the second.
 */
const getModuleAliasesForESLint = () => {
	const moduleAliases = getModuleAliasesFromPackage()
	return Object.keys(moduleAliases).map((stem) => [stem, moduleAliases[stem]])
}

/**
 * Loads aliases from `package.json` data and transforms them into Jest's configuration format:
 * `{ alias: destination }`
 *
 * @returns {Object} An object containing the aliases and destinations, with each alias as a key
 *                   and its corresponding destination as the value.
 */
const getModuleAliasesForJest = () => {
	const moduleAliases = getModuleAliasesFromPackage()
	return Object.keys(moduleAliases).reduce((accumulator, alias) => {
		const transformedAlias = {
			alias: `^${alias}(.*)$`,
			destination: `${moduleAliases[alias].replace('./', '<rootDir>/')}$1`,
		}
		return {
			...accumulator,
			[transformedAlias.alias]: transformedAlias.destination,
		}
	}, {})
}

module.exports = {
	getModuleAliasesForESLint,
	getModuleAliasesForJest,
}

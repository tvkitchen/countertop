// Require our actual `package.json` data for use by this file.
//
// NB: `package` is a reserved word
const packageData = require('../../package.json')

// Extracts and returns the `module-alias` configuration from our `package.json` data.
//
// We don't control the `_moduleAliases` variable name, we just work with it.
// eslint-disable-next-line no-underscore-dangle
const getModuleAliasesFromPackage = () => packageData._moduleAliases || {}

// Loads aliases from our `package.json` data and returns them, transformed into ESLint's
// configuration format: `[[alias, destination]]`.
const getModuleAliasesForESLint = () => {
	const moduleAliases = getModuleAliasesFromPackage()
	return Object.keys(moduleAliases).map((stem) => [stem, moduleAliases[stem]])
}

// Loads aliases from our `package.json` data and returns them, transformed into Jest's
// configuration format: `{ alias: destination }`.
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

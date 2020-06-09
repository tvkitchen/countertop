const { getModuleAliasesForJest } = require('./lib/utils/moduleAlias')

const settings = {
	moduleNameMapper: getModuleAliasesForJest(),
	setupFiles: ['./lib/utils/jest.setup.js'],
	silent: true,
}

module.exports = settings

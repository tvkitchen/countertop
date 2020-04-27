const { getModuleAliasesForJest } = require('./lib/utils/moduleAlias')

const settings = {
	moduleNameMapper: getModuleAliasesForJest(),
}

module.exports = settings

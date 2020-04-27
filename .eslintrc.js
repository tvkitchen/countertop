const { getModuleAliasesForESLint } = require('./lib/utils/moduleAlias')

const settings = {
	"extends": "airbnb-base",
	"parser": "babel-eslint",
	"rules": {
		"semi": [2, "never"],
		"indent": [2, "tab"],
		"no-tabs": 0
	},
	"env": {
		"es6": true,
		"node": true,
		"jest": true
	},
	"settings": {
		"import/resolver": {
			"alias": getModuleAliasesForESLint()
		}
	}
}

module.exports = settings

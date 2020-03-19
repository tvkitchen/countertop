const package = require('./package.json')

const extractModuleAliasesFromPackage = (package) => {
	const aliasStems = Object.keys(package._moduleAliases)
	return aliasStems.map(
		(stem) => [stem, package._moduleAliases[stem]]
	)
}
const aliases = extractModuleAliasesFromPackage(package)
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
			"alias": aliases
		}
	}
}

module.exports = settings

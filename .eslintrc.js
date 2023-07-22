module.exports = {
	"extends": "airbnb-base",
	"parser": "@babel/eslint-parser",
	"rules": {
		"semi": [2, "never"],
		"indent": [2, "tab", {"SwitchCase": 1}],
		"no-tabs": 0,
		"import/extensions": [
				"error",
				"ignorePackages",
				{
					"js": "never",
					"jsx": "never",
					"ts": "never",
					"tsx": "never"
				}
		]
	},
	"env": {
		"es6": true,
		"node": true,
		"jest": true
	},
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"]
		},
		"import/resolver": {
			"typescript": {
				"alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
			}
		}
	}
}

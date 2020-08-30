module.exports = {
	"extends": "airbnb-base",
	"parser": "babel-eslint",
	"rules": {
		"semi": [2, "never"],
		"indent": [2, "tab", {"SwitchCase": 1}],
		"no-tabs": 0
	},
	"env": {
		"es6": true,
		"node": true,
		"jest": true
	}
}

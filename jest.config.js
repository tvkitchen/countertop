module.exports = {
	"testPathIgnorePatterns": [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/src/.*\.ts",
	],
	collectCoverageFrom: ["src/**/*.js"],
	silent: true,
}

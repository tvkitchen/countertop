module.exports = {
	testPathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/src/.*\\.ts",
	],
	testRegex: '(/__tests__/.*)(test|spec)\\.jsx?$',
	collectCoverageFrom: ["src/**/*.js"],
	coveragePathIgnorePatterns: [
		'__tests__',
		'/src/test/'
	],
	silent: true,
}

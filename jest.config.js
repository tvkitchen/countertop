module.exports = {
	testPathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/src/.*\\.ts",
	],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[j]sx?$',
	collectCoverageFrom: ["src/**/*.js"],
	silent: true,
}

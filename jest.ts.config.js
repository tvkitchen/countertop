module.exports = {
	testEnvironment: 'node',
	testPathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/src/.*\\.js",
	],
	testRegex: '(/__tests__/.*)(test|spec)\\.tsx?$',
	collectCoverageFrom: ["src/**/*.ts"],
	coveragePathIgnorePatterns: [
		'__tests__',
		'/src/test/'
	],
	silent: true,
	passWithNoTests: true,
};

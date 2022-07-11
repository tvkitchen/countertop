module.exports = {
	globals: {
		"ts-jest": {
			tsconfig: 'tsconfig.dev.json',
		},
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
		"<rootDir>/src/.*\\.js",
	],
	collectCoverageFrom: ["src/**/*.ts"],
	silent: true,
	passWithNoTests: true,
};

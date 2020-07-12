import {
	loadTestData,
} from '%src/tools/utils/jest'

describe('jest', () => {
	describe('loadTestData', () => {
		it('should load data when valid json is provided', () => {
			expect(loadTestData(__dirname, 'loadTestData.json')).toEqual(['this loads valid json'])
		})
	})
})

import {
	loadTestData,
} from '%src/lib/utils/jest'

describe('jest', () => {
	describe('loadTestData', () => {
		it('should load data when valid json is provided', () => {
			expect(loadTestData(__dirname, 'loadTestData.json')).toEqual(['this loads valid json'])
		})
	})
})

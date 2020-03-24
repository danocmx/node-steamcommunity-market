const { assert } = require('chai');
const { describe, it } = require('mocha');

const CommunityMarket = require('../communityMarket');

const communityMarket = new CommunityMarket();

describe('Search', () => {
	it('functionality', (done) => {
		const count = 220;

		communityMarket.search({
			appid: 440,
			count,
		})
			.then((search) => {
				// Set of tests that will throw an error if not successful
				// Unfortunaly cannot be tested otherwise
				assert.instanceOf(search, CommunityMarket.Search.CMSearch);
				assert.equal(search.totalCount, count);
				/* eslint-disable-next-line */
				for (const _listing of search) {}

				done();
			});
	})
		.timeout(10000);
});

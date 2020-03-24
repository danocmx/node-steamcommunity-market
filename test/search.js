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
				assert.instanceOf(search, CommunityMarket.Search.CMSearch);
				assert.equal(search.totalCount, count);

				done();
			});
	})
		.timeout(10000);
});

const { assert } = require('chai');
const { describe, it } = require('mocha');

const CommunityMarket = require('../communityMarket');

const communityMarket = new CommunityMarket();

describe('Listings', () => {
	it('functionality', (done) => {
		const count = 110;

		communityMarket.getListings({
			marketHashName: 'Earbuds',
			appid: 440,
			count,
		})
			.then((listings) => {
				assert.instanceOf(listings, CommunityMarket.Listings.CMListings);
				assert.equal(listings.totalCount, count);

				done();
			});
	})
		.timeout(10000);
});

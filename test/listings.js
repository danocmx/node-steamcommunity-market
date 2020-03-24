const { assert } = require('chai');
const { describe, it } = require('mocha');

const CommunityMarket = require('../communityMarket');

const communityMarket = new CommunityMarket();

describe('Listings', () => {
	const count = 110;

	it('functionality', (done) => {
		communityMarket.getListings({
			marketHashName: 'Earbuds',
			appid: 440,
			count,
		})
			.then((listings) => {
				// Set of tests that will throw an error if not successful
				// Unfortunaly cannot be tested otherwise
				assert.equal(listings.totalCount, count);
				assert.instanceOf(listings, CommunityMarket.Listings.CMListings);
				/* eslint-disable-next-line */
				for (const _listing of listings) {}

				done();
			});
	});
})
	.timeout(10000);

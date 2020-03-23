const { assert } = require('chai');
const { describe, it } = require('mocha');

const CommunityMarket = require('../communityMarket');

describe('CommunityMarket creation', () => {
	it('Creates an instance', () => {
		const communityMarket = new CommunityMarket({
			http: {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/72.0',
				},
			},
			localization: {
				currency: 3,
				country: 'en',
				language: 'us',
			},
			listings: {
				query: 'Arcana',
			},
			search: {
				noRender: 0,
				sortDir: 'desc',
				sortColumn: 'quantity',
			},
		});

		assert.instanceOf(communityMarket, CommunityMarket);
	});
});

const { assert } = require('chai');
const { describe, it } = require('mocha');

const CommunityMarket = require('../index');


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

describe('CommunityMarket methods', () => {
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
	});

	it('histogram', (done) => {
		communityMarket.getHistogram({
			itemNameID: 1,
			appid: 440,
		})
			.then((histogram) => {
				assert.instanceOf(histogram, CommunityMarket.classes.CMHistogram);

				done();
			});
	});

	it('listings', (done) => {
		const count = 170;

		communityMarket.getListings({
			marketHashName: 'Earbuds',
			appid: 440,
			count,
		})
			.then((listings) => {
				assert.instanceOf(listings, CommunityMarket.classes.CMListings);
				assert.equal(listings.totalCount, count);

				done();
			});
	});

	it('overview', (done) => {
		communityMarket.getOverview({
			appid: 440,
			marketHashName: 'Tour of Duty Ticket',
		})
			.then((overview) => {
				assert.instanceOf(overview, CommunityMarket.classes.CMOverview);

				done();
			});
	});

	it('search', (done) => {
		const count = 220;

		communityMarket.search({
			appid: 440,
			count,
		})
			.then((search) => {
				assert.instanceOf(search, CommunityMarket.classes.CMSearch);
				assert.equal(search.totalCount, count);

				done();
			});
	});
});

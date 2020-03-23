const { assert } = require('chai');
const { describe, it } = require('mocha');

const CommunityMarket = require('../communityMarket');

const communityMarket = new CommunityMarket();

describe('Histogram', () => {
	it('functionality', (done) => {
		communityMarket.getHistogram({
			itemNameID: 1,
			appid: 440,
		})
			.then((histogram) => {
				assert.instanceOf(histogram, CommunityMarket.Histogram.CMHistogram);

				done();
			});
	});
});

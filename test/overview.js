const { assert } = require('chai');
const { describe, it } = require('mocha');

const CommunityMarket = require('../communityMarket');

const communityMarket = new CommunityMarket();

describe('Overview', () => {
	it('functionality', (done) => {
		communityMarket.getOverview({
			appid: 440,
			marketHashName: 'Tour of Duty Ticket',
		})
			.then((overview) => {
				assert.instanceOf(overview, CommunityMarket.Overview.CMOverview);

				done();
			});
	});
});

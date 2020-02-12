/* eslint-disable */

const CMListings = require('./classes/CMListings');
const MarketMethod = require('./MarketMethod');
const MarketListings = require('./..')


class Listings extends MarketMethod {
	get(params) {
		const listingParams = this.getParams(params);

		return new MarketListings.fetch(listingParams)
			.then((rawListings) => new CMListings(this, listingParams, rawListings));
	}
}


module.exports = Listings;

/* eslint-disable */

const CMListings = require('./classes/CMListings');
const MarketMethod = require('./MarketMethod');
const ListingsHandler = require('./ListingsHandler');


class Listings extends MarketMethod {
	get(params) {
		const listingParams = this.getParams(params);

		return new ListingsHandler(listingParams, this.request)
			.fetch()
			.then((rawListings) => new CMListings(this, listingParams, rawListings));
	}
}


module.exports = Listings;

/* eslint-disable */

const CMListings = require('../DataClasses/CMListings');
const MarketMethod = require('../MarketMethod');
const ListingsHandler = require('./ListingsHandler');


class Listings extends MarketMethod {
	static get defaultParams() {
		return {
			start: 0,
			count: null,
			query: undefined,
		};
	}
	
	get(params) {
		const listingParams = this.getParams(params);

		return new ListingsHandler(listingParams, this.request)
			.fetch()
			.then((rawListings) => new CMListings(this, listingParams, rawListings));
	}
}


module.exports = Listings;
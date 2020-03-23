const CMListings = require('./Listings/CMListings');
const MarketMethod = require('../MarketMethod');
const ListingsHandler = require('./Listings/ListingsHandler');


class Listings extends MarketMethod {
	static get defaultParams() {
		return {
			start: 0,
			count: null,
			query: undefined,
		};
	}

	constructor({ globalOptions, methodOptions }) {
		super({
			globalOptions,
			methodOptions: { ...Listings.defaultParams, ...methodOptions },
			useLocalizationParams: true,
		});
	}

	get(params) {
		const listingParams = this.getParams(params);

		return new ListingsHandler(listingParams, this.request)
			.fetch()
			.then((rawListings) => new CMListings(this, listingParams, rawListings));
	}
}


module.exports = Listings;

const CMResponse = require('../CMResponse');
const CMSearchListing = require('./CMSearchItem');


class CMSearch extends CMResponse {
	constructor(handler, params, data) {
		super(handler, params, data);

		this.getSearchListings(data);

		this.totalCount = this.listings.length;
	}

	getSearchListings(search) {
		const listings = [];

		search.forEach((listing) => {
			listings.push(
				new CMSearchListing(
					listing,
					this.date,
				),
			);
		});

		this.listings = listings;
	}

	update(params) {
		const searchParams = {};

		Object.assign(searchParams, this.params, params);

		return this.handler
			.search(params)
			.then((search) => {
				this.updateFromObject(search);

				return this;
			});
	}

	updateFromObject(search) {
		this.listings = search.listings;
		this.totalCount = search.totalCount;
	}
}


module.exports = CMSearch;

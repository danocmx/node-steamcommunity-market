const CMResponse = require('./CMResponse');
const CMSearchListing = require('./CMSearchListing');


class CMSearch extends CMResponse {
	constructor(communityMarket, params, data) {
		super(communityMarket, params, data);

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

	update() {
		return this.communityMarket.search(this.params)
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

const RecursiveMarketMethod = require('./RecursiveMarketMethod');


class ListingsHandler extends RecursiveMarketMethod {
	constructor(qs, request) {
		super(qs, request);

		this.listings = null;

		this.setEndpoint();
	}

	setEndpoint() {
		this.url = `/listings/${this.appid}/${encodeURIComponent(this.market_hash_name)}/render`;
	}

	fetch() {
		return this
			.request({
				url: this.url,
				qs: this.qs,
				json: true,
				gzip: true,
			})
			.then((rawListings) => {
				this.handleResponse(rawListings);

				if (this.shouldFetchNextPage()) {
					return this
						.setQSForNewFetch()
						.fetch();
				}

				return this.listings;
			});
	}

	handleResponse(rawListings) {
		if (!this.listings) {
			this.listings = rawListings;

			this.setGameIds();
		} else {
			Object.assign(this.listings.listinginfo, rawListings.listinginfo);
			Object.assign(
				this.listings.assets[this.appid][this.context],
				rawListings.assets[this.appid][this.contextid],
			);
		}

		this.setCurrentCount();
		this.totalCount = rawListings.total_count;
	}

	setGameIds() {
		const [appid] = Object.keys(this.assets);
		const [contextid] = Object.keys(this.assets[appid]);

		this.appid = appid;
		this.contextid = contextid;
	}

	setCurrentCount() {
		this.currentCount = Object.keys(this.listings.listinginfo).length;
	}
}


module.exports = ListingsHandler;

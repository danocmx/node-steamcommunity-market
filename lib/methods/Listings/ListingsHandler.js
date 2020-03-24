const RecursiveMarketMethod = require('../../RecursiveMarketMethod');

const sanitizeListingQS = require('./sanitizeListingQS');


class ListingsHandler extends RecursiveMarketMethod {
	constructor(qs, request) {
		super(
			sanitizeListingQS(qs),
			request,
		);

		this.appid = qs.appid;
		this.marketHashName = qs.marketHashName;

		this.listings = null;

		this.setEndpoint();
	}

	setEndpoint() {
		this.url = `/listings/${this.appid}/${encodeURIComponent(this.marketHashName)}/render`;
	}

	fetch() {
		return this.request
			.send('GET', this.url, this.qs)
			.then(({ data }) => {
				this.processResponse(data);

				if (this.shouldFetchNextPage()) {
					return this
						.setQSForNewFetch()
						.fetch();
				}

				return this.listings;
			});
	}

	processResponse(rawListings) {
		if (!this.listings) {
			if (rawListings.length <= 0) {
				this.stopped = true;

				return;
			}

			// Sets first response
			this.listings = rawListings;

			this.setGameIds();
		} else {
			// Updates
			Object.assign(this.listings.listinginfo, rawListings.listinginfo);

			Object.assign(
				this.listings.assets[this.appid][this.contextid],
				rawListings.assets[this.appid][this.contextid],
			);
		}

		this.setCurrentCount();
		this.totalCount = rawListings.total_count;
	}

	setGameIds() {
		const { assets } = this.listings;

		const [appid] = Object.keys(assets);
		const [contextid] = Object.keys(assets[appid]);

		this.appid = appid;
		this.contextid = contextid;
	}

	setCurrentCount() {
		this.currentCount = Object.keys(this.listings.listinginfo).length;
	}
}


module.exports = ListingsHandler;

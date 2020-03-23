const RecursiveMarketMethod = require('../../RecursiveMarketMethod');


class SearchHandler extends RecursiveMarketMethod {
	constructor(qs, request) {
		super(qs, request);

		this.searchResults = [];
	}

	fetch() {
		return this
			.request({
				// eslint-disable-next-line global-require
				url: require('../Search').endpoint,
				qs: this.qs,
				json: true,
				gzip: true,
			})
			.then((rawSearch) => {
				this.processResponse(rawSearch);

				if (this.shouldFetchNextPage()) {
					return this
						.setQSForNewFetch()
						.fetch();
				}

				return this.searchResults;
			});
	}

	processResponse(rawSearch) {
		this.totalCount = rawSearch.total_count;

		if (this.totalCount <= 0) {
			// Stops requesting
			this.stopped = true;

			return;
		}

		const { results } = rawSearch;

		this.searchResults.push(...results);

		this.currentCount = this.searchResults.length;
	}
}


module.exports = SearchHandler;

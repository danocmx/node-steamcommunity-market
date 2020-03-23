const RecursiveMarketMethod = require('../../RecursiveMarketMethod');


class SearchHandler extends RecursiveMarketMethod {
	constructor(qs, request) {
		super(qs, request);

		this.searchResults = [];
	}

	fetch() {
		return this
			.request(
				// Same case as before, the object is not created so I cannot redeem the endpoint
				// eslint-disable-next-line global-require
				require('../Search').endpoint,
				{
					params: this.qs,
				},
			)
			.then(({ data }) => {
				this.processResponse(data);

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

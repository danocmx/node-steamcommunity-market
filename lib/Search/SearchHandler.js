const RecursiveMarketMethod = require('./RecursiveMarketMethod');
const Search = require('.');


class SearchHandler extends RecursiveMarketMethod {
	constructor(qs, request) {
		super(qs, request);

		this.searchResults = null;
	}

	fetch() {
		return this
			.request({
				url: Search.endpoint,
				qs: this.qs,
				json: true,
				gzip: true,
			})
			.then((rawSearch) => {
				this.handleResponse(rawSearch);

				if (this.shouldFetchNextPage()) {
					return this
						.setQSForNewFetch()
						.fetch();
				}

				return this.searchResults;
			});
	}

	handleResponse(rawSearch) {
		this.totalCount = rawSearch.total_count;

		const { results } = rawSearch;

		if (!this.searchResults) this.searchResults = results;
		else this.searchResults.push(...results);

		this.currentCount = this.searchResults.length;
	}
}


module.exports = SearchHandler;

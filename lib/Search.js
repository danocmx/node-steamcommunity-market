const MarketMethod = require('./MarketMethod');
const SearchHandler = require('./SearchHandler');
const CMSearch = require('./classes/CMSearch');


class Search extends MarketMethod {
	get(params) {
		const searchParams = this.getParams(params);

		return new SearchHandler(searchParams, this.request)
			.fetch()
			.then((rawSearch) => new CMSearch(this, searchParams, rawSearch));
	}
}


module.exports = Search;

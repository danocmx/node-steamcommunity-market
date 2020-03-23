const MarketMethod = require('../MarketMethod');
const SearchHandler = require('./Search/SearchHandler');
const CMSearch = require('./Search/CMSearch');

const handleSearchParams = require('./Search/handleParams');


class Search extends MarketMethod {
	static get endpoint() { return '/search/render'; }

	static get defaultParams() {
		return {
			query: '',
			searchDescriptions: false,
			start: 0,
			sortColumn: 'price',
			sortDir: 'asc',
			noRender: 1,
		};
	}

	constructor({ globalOptions, methodOptions }) {
		super({
			globalOptions,
			methodOptions: { ...Search.defaultParams, ...methodOptions },
			paramsHandler: handleSearchParams,
		});
	}

	get(params) {
		const searchParams = this.getParams(params);

		return new SearchHandler(searchParams, this.request)
			.fetch()
			.then((rawSearch) => new CMSearch(this, searchParams, rawSearch));
	}
}


module.exports = Search;

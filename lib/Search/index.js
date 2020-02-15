const _ = require('lodash');

const MarketMethod = require('../MarketMethod');
const SearchHandler = require('./SearchHandler');
const CMSearch = require('./CMSearch');


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

	static handleParams(params) {
		const handleParams = { ...params };

		if (handleParams.searchDescriptions || handleParams.searchDescriptions === false) {
			handleParams.search_descriptions = handleParams.searchDescriptions ? 1 : 0;
			delete handleParams.searchDescriptions;
		}

		if (handleParams.sortColumn) {
			handleParams.sort_column = handleParams.sortColumn;
			delete handleParams.sortColumn;
		}

		if (handleParams.sortDir) {
			handleParams.sort_dir = handleParams.sortDir;
			delete handleParams.sortDir;
		}

		if (handleParams.noRender || handleParams.noRender === 0) {
			handleParams.norender = handleParams.noRender;
			delete handleParams.noRender;
		}

		if (handleParams.appid) {
			_.forOwn(handleParams, (value, param) => {
				if (['query', 'appid', 'search_descriptions', 'start', 'count', 'sort_column', 'sort_dir', 'norender'].includes(param)) {
					return;
				}

				handleParams[`category_${handleParams.appid}_${param}[]`] = `tag_${value}`;
				delete handleParams[param];
			});
		}

		return handleParams;
	}

	get(params) {
		const searchParams = this.getParams(params);

		return new SearchHandler(searchParams, this.request)
			.fetch()
			.then((rawSearch) => new CMSearch(this, searchParams, rawSearch));
	}
}


module.exports = Search;

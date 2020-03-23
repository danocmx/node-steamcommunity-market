const MarketMethod = require('../MarketMethod');
const SearchHandler = require('./Search/SearchHandler');
const CMSearch = require('./Search/CMSearch');

const renameProperties = require('../../utils/renameProperties');
const modifyAppParams = require('./Search/modifyAppParams');


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
		let methodParams = renameProperties(params, {
			searchDescriptions: 'search_descriptions',
			sortColumn: 'sort_column',
			sortDir: 'sort_dir',
			noRender: 'norender',
		});

		methodParams.search_descriptions = methodParams.search_descriptions ? 1 : 0;

		if (methodParams.appid) {
			methodParams = modifyAppParams(methodParams);
		}

		return methodParams;
	}

	constructor({ globalOptions, methodOptions }) {
		super({
			globalOptions,
			methodOptions: { ...Search.defaultParams, ...methodOptions },
			paramsHandler: Search.handleParams,
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

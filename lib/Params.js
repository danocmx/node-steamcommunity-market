const _ = require('lodash');


/**
 * Handles parameters defaults
 * @class
 */
class Params {
	/**
	 * @constructor
	 * @param {object} settings.localization
	 * @param {number} settings.localization.currency
	 * @param {string} settings.localization.language
	 * @param {string} settings.localization.country
	 * @param {object} settings.histogram
	 * @param {number} settings.twoFactor
	 * @param {object} settings.listings
	 * @param {number} settings.listings.start
	 * @param {number|void} settings.listings.count
	 * @param {string|void} settings.listings.query
	 */
	constructor(settings) {
		const defaultSettings = {
			localization: {},
			histogram: {},
			listings: {},
			search: {},
		};
		Object.assign(defaultSettings, settings);

		this.localization = {
			currency: 1,
			language: 'en',
			country: 'us',
		};
		Object.assign(this.localization, defaultSettings.localization);

		this.histogram = {
			twoFactor: 0,
		};
		Object.assign(this.histogram, defaultSettings.histogram);

		this.listings = {
			start: 0,
			count: null,
			query: undefined,
		};
		Object.assign(this.listings, defaultSettings.listings);

		this.search = {
			query: '',
			searchDescriptions: false,
			start: 0,
			sortColumn: 'price',
			sortDir: 'asc',
			noRender: 1,
		};
		Object.assign(this.search, defaultSettings.search);
	}

	/**
	 * Gets histogram parameters for CommunityMarket
	 * @param {string} params.itemNameID item hash name
	 * @param {string} params.twoFactor
	 * @see getLocalization for localization parameters
	 * @return {object}
	 */
	getHistogram(params) {
		const histogramParams = {};
		const localizationParams = this.getLocalization(params);

		Object.assign(histogramParams, this.histogram);
		Object.assign(histogramParams, localizationParams);

		if (histogramParams.itemNameID || histogramParams.itemNameID === 0) {
			histogramParams.item_nameid = histogramParams.itemNameID;
			delete histogramParams.itemNameID;
		}

		if (histogramParams.twoFactor || histogramParams.twoFactor === 0) {
			histogramParams.two_factor = histogramParams.twoFactor;
			delete histogramParams.twoFactor;
		}

		return histogramParams;
	}

	/**
	 * Gets listing parameters for CommunityMarket
	 * @param {number} params.start
	 * @param {number|void} params.count if void fetches all listings, otherwise by number
	 * @param {string|void} params.query
	 * @return {object}
	 */
	getListings(params) {
		const listingParams = {};
		const localizationParams = this.getLocalization(params);

		Object.assign(listingParams, this.listings);
		Object.assign(listingParams, localizationParams);

		delete listingParams.marketHashName;
		delete listingParams.appid;

		return listingParams;
	}

	/**
	 * Gets overview parameters for CommunityMarket
	 * @param {string} params.marketHashName
	 * @param {number} params.appid
	 * @param {number} params.currency
	 * @return {object}
	 */
	getOverview(params) {
		const overviewParams = {};

		Object.assign(overviewParams, { currency: this.localization.currency });
		Object.assign(overviewParams, params);

		if (overviewParams.marketHashName) {
			overviewParams.market_hash_name = overviewParams.marketHashName;
			delete overviewParams.marketHashName;
		}

		return overviewParams;
	}

	getHistory(params) {
		const historyParams = {};
		const localizationParams = this.getLocalization(params);

		Object.assign(historyParams, localizationParams);

		if (historyParams.marketHashName) {
			historyParams.market_hash_name = historyParams.marketHashName;
			delete historyParams.marketHashName;
		}

		return historyParams;
	}

	getSearch(params) {
		const searchParams = {};

		Object.assign(searchParams, this.search);
		Object.assign(searchParams, params);

		if (searchParams.searchDescriptions || searchParams.searchDescriptions === false) {
			searchParams.search_descriptions = searchParams.searchDescriptions ? 1 : 0;
			delete searchParams.searchDescriptions;
		}

		if (searchParams.sortColumn) {
			searchParams.sort_column = searchParams.sortColumn;
			delete searchParams.sortColumn;
		}

		if (searchParams.sortDir) {
			searchParams.sort_dir = searchParams.sortDir;
			delete searchParams.sortDir;
		}

		if (searchParams.noRender || searchParams.noRender === 0) {
			searchParams.norender = searchParams.noRender;
			delete searchParams.noRender;
		}

		if (searchParams.appid) {
			_.forOwn(searchParams, (value, param) => {
				if (['query', 'appid', 'search_descriptions', 'start', 'count', 'sort_column', 'sort_dir', 'norender'].includes(param)) {
					return;
				}

				searchParams[`category_${searchParams.appid}_${param}[]`] = `tag_${value}`;
				delete searchParams[param];
			});
		}

		return searchParams;
	}

	/**
	 * Gets localization parameters for CommunityMarket
	 * @param {number} [params.currency=1]
	 * @param {string} [params.language='en']
	 * @param {string} [params.country='us']
	 * @return {object}
	 */
	getLocalization(params) {
		const localizationParams = {};

		Object.assign(localizationParams, this.localization);
		Object.assign(localizationParams, params);

		return localizationParams;
	}
}


module.exports = Params;

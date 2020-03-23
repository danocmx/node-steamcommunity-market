const Histogram = require('./methods/Histogram');
const History = require('./methods/History');
const Listings = require('./methods/Listings');
const Overview = require('./methods/Overview');
const Search = require('./methods/Search');
const Options = require('./Options');


/**
 * Main production class.
 * @class
 */
class CommunityMarket {
	static get url() { return 'https://steamcommunity.com/market'; }

	/**
	 * @constructor
	 * @param {object} [options]
	 * @param {object} [options.http] HTTP setting default, look at request docs.
	 * @param {object} [options.localization] Default localization settings.
	 * @param {ECMCurrencyCodes} [options.localization.currency=1]
	 * @param {string} [options.localization.country='us'] Country name shortened.
	 * @param {string} [options.localization.language='en'] Language name shortened.
	 * @param {object} [options.histogram] Histogram default settings.
	 * @param {object} [options.listings] Listing default settings.
	 * @param {object} [options.search] Search default settings.
	 * @param {object} [options.history]
	 * @param {object} [options.overview]
 	 */
	constructor(options = {}) {
		this.options = new Options(options);

		this.histogram = new Histogram({
			globalOptions: this.options,
			methodOptions: options.histogram,
		});

		this.history = new History({
			globalOptions: this.options,
			methodOptions: options.history,
		});

		this.listings = new Listings({
			globalOptions: this.options,
			methodOptions: options.listings,
		});

		this.overview = new Overview({
			globalOptions: this.options,
			methodOptions: options.overview,
		});

		this.searchHandler = new Search({
			globalOptions: this.options,
			methodOptions: options.search,
		});
	}

	/**
	 * Gets histogram parameters for CommunityMarket.
	 * @param {string} params.itemNameID Item market hash name.
	 * @param {string} [params.twoFactor=0] Unknown setting.
	 * @see Params.prototype.getLocalization For localization parameters.
	 * @return {Promise<CMHistogram>}
	 */
	getHistogram(params) {
		return this.histogram.get(params);
	}

	/**
	 * Gets CommunityMarket item listings.
	 * @param {string} params.marketHashName Steam name that is included in the url.
	 * @param {number} params.appid Game ID on steam.
	 * @param {number} [params.start=0] Starting point.
	 * @param {number|void} [params.count] If void fetches all listings, otherwise by number.
	 * @param {string|void} [params.query] Description query search.
	 * @see Params.prototype.getLocalization For localization parameters.
	 * @return {Promise<CMListings>}
	 */
	getListings(params) {
		return this.listings.get(params);
	}

	/**
	 * Gets overview for CommunityMarket item.
	 * @param {string} params.marketHashName Steam name that is included in the url.
	 * @param {number} params.appid Game ID on steam.
	 * @param {ECMCurrencyCodes} [params.currency=1]
	 * @return {Promise<CMOverview>}
	 */
	getOverview(params) {
		return this.overview.get(params);
	}

	/**
	 * Searches the CommunityMarket.
	 * @param {object} [params={}] Can also include other appid specific parameters.
	 * @param {string} [params.query=]
	 * @param {number} [params.start=0] Search start.
	 * @param {number} [params.count] How many do we want, if void searches for all.
	 * @param {boolean} [params.searchDescriptions=false] If we want to search descriptions of items.
	 * @param {string} [params.sortColumn=price] Which column get items sorted by.
	 * @param {string} [params.sortDir=asc] Which direction.
	 * @param {number} [params.appid] Game ID on steam.
	 * @return {Promise<CMSearch>}
	 */
	search(params = {}) {
		return this.searchHandler.get(params);
	}

	/**
	 * Gets sale history. Currently does not work.
	 * @param {string} params.marketHashName Steam name that is included in the url.
	 * @param {number} params.appid Game ID on steam.
	 * @see Params.prototype.getLocalization For localization parameters.
	 * @return {Promise<CMHistory>}
	 */
	getPriceHistory(params) {
		return this.history.get(params);
	}
}


module.exports = CommunityMarket;

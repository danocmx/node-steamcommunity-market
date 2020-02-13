const Params = require('./Params');

const Histogram = require('./Histogram');
const History = require('./History');
const Listings = require('./Listings');
const Overview = require('./Overview');
const Search = require('./Search');


/**
 * Main production class.
 * @class
 */
class CommunityMarket {
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
 	 */
	constructor(options = {}) {
		this.params = new Params(options);

		this.histogram = new Histogram();
		this.history = new History();
		this.listings = new Listings();
		this.overview = new Overview();
		this.search = new Search();
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
		return this.search.get(params);
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

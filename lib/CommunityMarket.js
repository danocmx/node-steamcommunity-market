const request = require('request-promise');

const Params = require('./Params');

const CMHistogram = require('./classes/CMHistogram');
const CMListings = require('./classes/CMListings');
const CMOverview = require('./classes/CMOverview');
const CMHistory = require('./classes/CMHistory');
const CMSearch = require('./classes/CMSearch');

const isRequestSuccessful = require('./utils/isRequestSuccessful');


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

		this.setupHTTP(options.http);
	}

	/**
	 * Gets histogram parameters for CommunityMarket.
	 * @param {string} params.itemNameID Item market hash name.
	 * @param {string} [params.twoFactor=0] Unknown setting.
	 * @see Params.prototype.getLocalization For localization parameters.
	 * @return {Promise<CMHistogram>}
	 */
	getHistogram(params) {
		const histogramParams = this.params.getHistogram(params);

		return this.requestAgent({
			uri: '/itemordershistogram',
			qs: histogramParams,
			json: true,
			gzip: true,
		})
			.then((data) => new CMHistogram(
				this,
				histogramParams,
				data,
			));
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
		const listingParams = this.params.getListings(params);

		const  howMuchMore = CommunityMarket.getFetchMoreParams(listingParams);

		return this.fetchListings({
			url: CommunityMarket.getListingsUrl(params),
			qs: { ...listingParams, count: howMuchMore ? 100 : listingParams.count },
			howMuchMore,
		})
			.then((data) => new CMListings(
				this,
				{
					appid: params.appid,
					marketHashName: params.marketHashName,
					...listingParams,
				},
				data,
			));
	}

	/**
	 * Gets us info how many listings we should fetch.
	 * @param {numer} param0.start Starting point, how many we skip.
	 * @param {number} param0.count How many listings we want.
	 * @return {number} How many listings do we need to fetch if it's over 100.
	 */
	static getFetchMoreParams({ start, count }) {
		let howMuchMore = 0;

		if (count > 100) {
			howMuchMore = parseInt(count);
			howMuchMore += start || 0;
		} else if (!count) {
			howMuchMore = Infinity;
		}

		return howMuchMore;
	}

	fetchListings({ url, qs, howMuchMore }, lastResponse) {
		return this.requestAgent({
			url,
			qs,
			json: true,
			gzip: true,
		})
			.then((listings) => {
				const totalCount = listings.total_count;
				const { assets, listinginfo } = listings;

				if (lastResponse) {
					Object.assign(lastResponse.listinginfo, listinginfo);

					const { appid, contextid } = CommunityMarket.getGameIds(assets);
					Object.assign(lastResponse.assets[appid][contextid], assets[appid][contextid]);
				}

				const fetchMoreInfo = {
					totalCount,
					currentCount: Object.keys(lastResponse ? lastResponse.listinginfo : listinginfo).length,
					desiredCount: howMuchMore,
				};

				return CommunityMarket.fetchAgain(fetchMoreInfo)
					? this.fetchListings(
						{
							url,
							qs: CommunityMarket.getFetchMoreQS(fetchMoreInfo, qs),
							howMuchMore,
						},
						lastResponse || listings,
					)
					: lastResponse || listings;
			})
			.catch((err) => lastResponse || Promise.reject(err));
	}

	/**
	 * Gets appid & contextid from listings fetch,
	 * All listings should have same appid & contextid.
	 * @param {object} assets Response from API.
	 */
	static getGameIds(assets) {
		const appid = Object.keys(assets)[0];
		const contextid = Object.keys(assets[appid])[0];

		return { appid, contextid };
	}

	static fetchAgain({ totalCount, currentCount, desiredCount }) {
		const celling = desiredCount > totalCount
			? totalCount
			: desiredCount;

		return currentCount < celling && desiredCount;
	}

	static getFetchMoreQS({ totalCount, currentCount, desiredCount }, qs) {
		const celling = desiredCount > totalCount
			? totalCount
			: desiredCount;

		const newQS = {
			...qs,
			start: currentCount,
			count: 0,
		};

		const restOfListings = celling - newQS.start;
		newQS.count = restOfListings > 100 ? 100 : restOfListings;

		return newQS;
	}

	static getListingsUrl({ appid, marketHashName }) {
		return `/listings/${appid}/${encodeURIComponent(marketHashName)}/render`;
	}

	/**
	 * Gets overview for CommunityMarket item.
	 * @param {string} params.marketHashName Steam name that is included in the url.
	 * @param {number} params.appid Game ID on steam.
	 * @param {ECMCurrencyCodes} [params.currency=1]
	 * @return {Promise<CMOverview>}
	 */
	getOverview(params) {
		const overviewParams = this.params.getOverview(params);

		return this.requestAgent({
			url: '/priceoverview',
			qs: overviewParams,
			json: true,
			gzip: true,
		})
			.then((data) => new CMOverview(
				this,
				overviewParams,
				data,
			));
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
		const searchParams = this.params.getSearch(params);

		const howMuchMore = CommunityMarket.getFetchMoreParams(searchParams);

		return this.fetchSearch({
			url: '/search/render',
			qs: { ...searchParams, count: howMuchMore ? 100 : searchParams.count },
			howMuchMore,
		})
			.then((data) => new CMSearch(
				this,
				searchParams,
				data,
			));
	}

	fetchSearch({ url, qs, howMuchMore }, lastResponse) {
		return this.requestAgent({
			url,
			qs,
			gzip: true,
			json: true,
		})
			.then((search) => {
				const totalCount = search.total_count;
				const { results } = search;

				if (lastResponse) {
					lastResponse.push(...results);
				}

				const fetchMoreInfo = {
					totalCount,
					currentCount: (lastResponse || results).length,
					desiredCount: howMuchMore,
				};

				return CommunityMarket.fetchAgain(fetchMoreInfo)
					? this.fetchSearch(
						{
							url,
							qs: CommunityMarket.getFetchMoreQS(fetchMoreInfo, qs),
							howMuchMore,
						},
						lastResponse || results,
					)
					: lastResponse || results;
			})
			.catch((err) => lastResponse || Promise.reject(err));
	}

	/**
	 * Gets sale history. Currently does not work.
	 * @param {string} params.marketHashName Steam name that is included in the url.
	 * @param {number} params.appid Game ID on steam.
	 * @see Params.prototype.getLocalization For localization parameters.
	 * @return {Promise<CMHistory>}
	 */
	getPriceHistory(params) {
		const historyParams = this.params.getHistory(params);

		return this.requestAgent({
			url: '/pricehistory',
			qs: historyParams,
			json: true,
			gzip: true,
		})
			.then((history) => new CMHistory(
				this,
				historyParams,
				history,
			));
	}

	request(options) {
		return this.requestAgent(options)
			.then((body) => {
				if (!body) {
					return Promise.reject(
						new Error('No body found.'),
					);
				}

				// JSON APIs have success property indicating the successness
				if (isRequestSuccessful(body.success, options.json)) {
					return Promise.reject(
						new Error('Request was unsuccessful.'),
					);
				}

				return body;
			});
	}

	setupHTTP(httpParams = {}) {
		const defaultHttpParams = {
			headers: {
				'User-Agent': 'Request-Promise',
			},
		};

		Object.assign(defaultHttpParams, httpParams);
		Object.assign(defaultHttpParams, { baseUrl: 'https://steamcommunity.com/market' });

		this.requestAgent = request.defaults(defaultHttpParams);
	}
}


module.exports = CommunityMarket;

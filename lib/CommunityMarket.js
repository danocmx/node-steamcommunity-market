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
	 * 
	 * @param {*} options 
	 */
	constructor(options = {}) {
		this.params = new Params(options);

		this.setupHTTP(options.http);
	}

	/**
	 * Gets histogram parameters for CommunityMarket
	 * @param {string} params.itemNameID item hash name
	 * @param {string} params.twoFactor
	 * @see Params.prototype.getLocalization for localization parameters
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
	 * Gets CommunityMarket item listings
	 * @param {number} params.start
	 * @param {number|void} params.count if void fetches all listings, otherwise by number
	 * @param {string|void} params.query
	 * @see Params.prototype.getLocalization for localization parameters
	 * @return {Promise<CMListings>}
	 */
	getListings(params) {
		const listingParams = this.params.getListings(params);

		const { fetchMore, howMuchMore } = CommunityMarket.getFetchMoreParams(listingParams);

		return this.fetchListings({
			url: CommunityMarket.getListingsUrl(params),
			qs: { ...listingParams, count: fetchMore ? 100 : listingParams.count },
			fetchMore,
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
	 * @param {numer} param0.start Starting point, how many we skip
	 * @param {number} param0.count How many listings we want
	 * @return {object} fetchMore - boolean, howMuchMore - number
	 */
	static getFetchMoreParams({ start, count }) {
		let fetchMore = false;
		let howMuchMore = 0;

		if (count > 100) {
			fetchMore = true;
			howMuchMore = parseInt(count);
			howMuchMore += start || 0;
		} else if (!count) {
			fetchMore = true;
			howMuchMore = Infinity;
		} else fetchMore = false;

		return { fetchMore, howMuchMore };
	}

	fetchListings({ url, qs, fetchMore, howMuchMore }, lastResponse) {
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
					fetchMore,
					currentCount: Object.keys(lastResponse ? lastResponse.listinginfo : listinginfo).length,
					desiredCount: howMuchMore,
				};

				return CommunityMarket.fetchAgain(fetchMoreInfo)
					? this.fetchListings(
						{
							url,
							qs: CommunityMarket.getFetchMoreQS(fetchMoreInfo, qs),
							fetchMore,
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
	 * All listings should have same appid & contextid
	 * @param {object} assets response from API
	 */
	static getGameIds(assets) {
		const appid = Object.keys(assets)[0];
		const contextid = Object.keys(assets[appid])[0];

		return { appid, contextid };
	}

	static fetchAgain({ totalCount, currentCount, desiredCount, fetchMore }) {
		const celling = desiredCount > totalCount
			? totalCount
			: desiredCount;

		return currentCount < celling && fetchMore;
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
	 * Gets overview for CommunityMarket item
	 * @param {string} params.marketHashName CommunityMarket item name
	 * @param {number} params.appid
	 * @param {number} params.currency ECMCurrencyCodes
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
	 * Searches the CommunityMarket
	 * @param {object} params Can also include other appid specific parameters.
	 * @param {string} params.query
	 * @param {number} params.start
	 * @param {number} params.count
	 * @param {boolean} params.searchDescriptions If we want to search descriptions of items
	 * @param {string} params.sortColumn Which column get items sorted by
	 * @param {string} params.sortDir Which direction
	 * @param {number} params.noRender Get html, currently useless.
	 * @param {number} params.appid
	 * @return {Promise<CMSearch>}
	 */
	search(params) {
		const searchParams = this.params.getSearch(params);

		const { fetchMore, howMuchMore } = CommunityMarket.getFetchMoreParams(searchParams);

		return this.fetchSearch({
			url: '/search/render',
			qs: { ...searchParams, count: fetchMore ? 100 : searchParams.count },
			fetchMore,
			howMuchMore,
		})
			.then((data) => new CMSearch(
				this,
				searchParams,
				data,
			));
	}

	fetchSearch({ url, qs, fetchMore, howMuchMore }, lastResponse) {
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
					fetchMore,
					currentCount: (lastResponse || results).length,
					desiredCount: howMuchMore,
				};

				return CommunityMarket.fetchAgain(fetchMoreInfo)
					? this.fetchSearch(
						{
							url,
							qs: CommunityMarket.getFetchMoreQS(fetchMoreInfo, qs),
							fetchMore,
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
	 * @param {string} params.marketHashName
	 * @param {number} params.appid
	 * @see Params.prototype.getLocalization for localization parameters
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

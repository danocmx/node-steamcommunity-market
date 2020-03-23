/* eslint-disable camelcase */
const parseCurrencyText = require('../../currencies/parseCurrencyText');
const CMResponse = require('../../CMResponse');


/**
 * Classifieds response data
 * @class CMOverview
 */
class CMOverview extends CMResponse {
	static handleParams(params) {
		const handledParams = { ...params };

		delete handledParams.language;
		delete handledParams.country;

		return handledParams;
	}

	/**
     * Classifieds response data
     * @constructor
     * @param {Number} appid
     * @param {String} marketHashName
     * @param {Object} qs                       from getMarketItemOverview
     * @param {Object} marketOverviewResults    from API
     */
	constructor(handler, params, data) {
		super(handler, params, data);

		const { lowest_price, median_price, volume } = data;

		this.lowestPrice = parseCurrencyText(lowest_price).price;
		this.medianPrice = parseCurrencyText(median_price || '').price;
		this.volume = volume || 0;
	}

	/**
     * Updates the overview
     * @see getMarketItemOverview
     */
	update(params) {
		const overviewParams = {};

		Object.assign(overviewParams, this.params, params);

		return this.handler
			.get(params)
			.then((overview) => {
				this.updateFromObject(overview);
				this.params = params;

				return this;
			});
	}

	updateFromObject({ lowestPrice, medianPrice, volume, date }) {
		this.lowestPrice = lowestPrice;
		this.medianPrice = medianPrice;
		this.volume = volume;
		this.date = date;
	}
}


module.exports = CMOverview;

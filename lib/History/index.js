const CMHistory = require('./CMHistory');
const MarketMethod = require('../MarketMethod');


class History extends MarketMethod {
	static get endpoint() { return 'pricehistory'; }

	static handleParams(params) {
		const handledParams = { ...params };

		if (handledParams.marketHashName) {
			handledParams.market_hash_name = handledParams.marketHashName;
			delete handledParams.marketHashName;
		}

		return handledParams;
	}

	constructor(options) {
		super({ ...options, useLocalizationParams: true });
	}

	get(params) {
		const historyParams = this.getParams(params);

		return this
			.request({
				url: History.endpoint,
				qs: historyParams,
				json: true,
				gzip: true,
			})
			.then((results) => new CMHistory(this, historyParams, results));
	}
}


module.exports = History;

const CMHistory = require('./History/CMHistory');
const MarketMethod = require('../MarketMethod');

const renameProperties = require('../../utils/renameProperties');


class History extends MarketMethod {
	static get endpoint() { return 'pricehistory'; }

	static handleParams(params) {
		return renameProperties(params, {
			marketHashName: 'market_hash_name',
		});
	}

	constructor(options) {
		super({
			...options,
			paramsHandler: History.handleParams,
			useLocalizationParams: true,
		});
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

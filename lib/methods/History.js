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

		return this.request
			.get(
				History.endpoint,
				{
					params: historyParams,
				},
			)
			.then(({ data }) => new CMHistory(this, historyParams, data));
	}
}


module.exports = History;

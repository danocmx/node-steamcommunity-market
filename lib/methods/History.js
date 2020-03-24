const CMHistory = require('./History/CMHistory');
const MarketMethod = require('../MarketMethod');

const handleHistoryParams = require('./Overview/handleParams');


class History extends MarketMethod {
	static get endpoint() { return 'pricehistory'; }

	constructor(options) {
		super({
			...options,
			paramsHandler: handleHistoryParams,
			useLocalizationParams: true,
		});
	}

	get(params) {
		const historyParams = this.getParams(params);

		return this.request
			.send('GET', History.endpoint, historyParams)
			.then(({ data }) => new CMHistory(this, historyParams, data));
	}
}


module.exports = History;

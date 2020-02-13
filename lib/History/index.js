const CMHistory = require('../DataClasses/CMHistory');
const MarketMethod = require('../MarketMethod');


class History extends MarketMethod {
	static get endpoint() { return 'pricehistory'; }

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

const CMOverview = require('./CMOverview');
const MarketMethod = require('../MarketMethod');


class Overview extends MarketMethod {
	static get endpoint() { return 'overview'; }

	static handleParams(params) {
		const handledParams = { ...params };

		if (handledParams.marketHashName) {
			handledParams.market_hash_name = handledParams.marketHashName;
			delete handledParams.marketHashName;
		}

		return handledParams;
	}

	get(params) {
		const overviewParams = this.getParams(params);

		return this
			.request({
				url: Overview.endpoint,
				qs: overviewParams,
				json: true,
				gzip: true,
			})
			.then((rawOverview) => new CMOverview(this, overviewParams, rawOverview));
	}
}


module.exports = Overview;

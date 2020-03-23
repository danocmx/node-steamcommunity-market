const CMOverview = require('./Overview/CMOverview');
const MarketMethod = require('../MarketMethod');

const renameProperties = require('../../utils/renameProperties');


class Overview extends MarketMethod {
	static get endpoint() { return '/priceoverview'; }

	static handleParams(params) {
		return renameProperties(params, {
			marketHashName: 'market_hash_name',
		});
	}

	constructor(options) {
		super({
			...options,
			paramsHandler: Overview.handleParams,
		});
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

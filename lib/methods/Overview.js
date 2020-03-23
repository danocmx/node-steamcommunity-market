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

		return this.request
			.get(
				Overview.endpoint,
				{
					params: overviewParams,
				},
			)
			.then(({ data }) => new CMOverview(this, overviewParams, data));
	}
}


module.exports = Overview;

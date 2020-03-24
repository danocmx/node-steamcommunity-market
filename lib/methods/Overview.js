const CMOverview = require('./Overview/CMOverview');
const MarketMethod = require('../MarketMethod');

const handleOverviewParams = require('./Overview/handleParams');


class Overview extends MarketMethod {
	static get endpoint() { return '/priceoverview'; }

	constructor(options) {
		super({
			...options,
			paramsHandler: handleOverviewParams,
		});
	}

	get(params) {
		const overviewParams = this.getParams(params);

		return this.request
			.send('GET', Overview.endpoint, overviewParams)
			.then(({ data }) => new CMOverview(this, overviewParams, data));
	}
}


module.exports = Overview;

const CMOverview = require('../DataClasses/CMOverview');
const MarketMethod = require('../MarketMethod');


class Overview extends MarketMethod {
	static get endpoint() { return 'overview'; }

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

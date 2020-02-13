const CMHistogram = require('./CMHistogram');
const MarketMethod = require('../MarketMethod');


class Histogram extends MarketMethod {
	static get endpoint() { return '/histogram'; }

	static get defaultParams() {
		return {
			twoFactor: 0,
		};
	}

	constructor(options) {
		super(options);
	}

	get(params) {
		const histogramParams = this.getParams(params);

		return this
			.request({
				url: Histogram.endpoint,
				qs: histogramParams,
				json: true,
				gzip: true,
			})
			.then((rawHistogram) => new CMHistogram(this, histogramParams, rawHistogram));
	}
}


module.exports = Histogram;

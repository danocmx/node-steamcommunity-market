const CMHistogram = require('./CMHistogram');
const MarketMethod = require('../MarketMethod');


class Histogram extends MarketMethod {
	static get endpoint() { return '/histogram'; }

	static get defaultParams() {
		return {
			twoFactor: 0,
		};
	}

	static handleParams(params) {
		const handledParams = { ...params };

		if (handledParams.itemNameID || handledParams.itemNameID === 0) {
			handledParams.item_nameid = handledParams.itemNameID;
			delete handledParams.itemNameID;
		}

		if (handledParams.handledParams || handledParams.twoFactor === 0) {
			handledParams.two_factor = handledParams.twoFactor;
			delete handledParams.twoFactor;
		}

		return handledParams;
	}

	constructor(options) {
		super({ ...options, useLocalizationParams: true });
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

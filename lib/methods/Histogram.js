const CMHistogram = require('./Histogram/CMHistogram');
const MarketMethod = require('../MarketMethod');

const renameProperties = require('../../utils/renameProperties');


class Histogram extends MarketMethod {
	// Add activity (itemordershistogram)
	static get endpoint() { return '/itemordershistogram'; }

	static get defaultParams() {
		return {
			twoFactor: 0,
		};
	}

	static handleParams(methodParams) {
		return renameProperties(methodParams, {
			itemNameID: 'item_nameid',
			twoFactor: 'two_factor',
		});
	}

	constructor({ globalOptions, methodOptions }) {
		super({
			globalOptions,
			methodOptions: { ...Histogram.defaultParams, ...methodOptions },
			paramsHandler: Histogram.handleParams,
			useLocalizationParams: true,
		});
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

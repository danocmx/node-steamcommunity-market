const CMHistogram = require('./Histogram/CMHistogram');
const MarketMethod = require('../MarketMethod');

const renameProperties = require('../../utils/renameProperties');


class Histogram extends MarketMethod {
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

		return this.request
			.get(
				Histogram.endpoint,
				{
					params: histogramParams,
				},
			)
			.then(({ data }) => new CMHistogram(this, histogramParams, data));
	}
}


module.exports = Histogram;

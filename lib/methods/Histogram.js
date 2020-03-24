const CMHistogram = require('./Histogram/CMHistogram');
const MarketMethod = require('../MarketMethod');

const handleHistogramParams = require('./Histogram/handleParams');


class Histogram extends MarketMethod {
	static get endpoint() { return '/itemordershistogram'; }

	static get defaultParams() {
		return {
			twoFactor: 0,
		};
	}

	constructor({ globalOptions, methodOptions }) {
		super({
			globalOptions,
			methodOptions: { ...Histogram.defaultParams, ...methodOptions },
			paramsHandler: handleHistogramParams,
			useLocalizationParams: true,
		});
	}

	get(params) {
		const histogramParams = this.getParams(params);

		return this.request
			.send('GET', Histogram.endpoint, histogramParams)
			.then(({ data }) => new CMHistogram(this, histogramParams, data));
	}
}


module.exports = Histogram;

const request = require('request-promise');
const Params = require('./Params');
const CommunityMarket = require('./CommunityMarket');
const Options = require('./Options');


class MarketMethod {
	constructor({ globalOptions, methodOptions, localization, http, useLocalizationParams }) {
		if (!globalOptions) this.optionse = new Options({ localization, http });
		else this.options = globalOptions;

		this
			.setupRequestAgent()
			.setupParams(methodOptions, useLocalizationParams);
	}

	get http() { return this.options.http; }

	setupRequestAgent() {
		this.request = request.defaults({
			baseUrl: CommunityMarket.url,
			...this.http,
		});

		return this;
	}

	setupParamsHandler(options, useLocalizationParams) {
		const newDefaultOptions = {};

		const marketMethod = Object.getPrototypeOf(this);

		Object.assign(newDefaultOptions, options, marketMethod.defaultParams || {});

		this.params = new Params(options, this.options, useLocalizationParams);

		const paramsHandler = marketMethod.handleParams;
		if (paramsHandler) {
			this.params.setHandler(paramsHandler);
		}
	}

	getParams(params) {
		return this.params.get(params);
	}
}


module.exports = MarketMethod;

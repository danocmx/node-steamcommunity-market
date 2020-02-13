const request = require('request-promise');
const ParamsHandler = require('./ParamsHandler');


class MarketMethod {
	constructor({ options, localization, http }) {
		this.setupHTTP(http)
			.setupParamsHandler(options, localization);
	}

	setupHTTP(options) {
		this.httpOptions = {
			headers: {
				'User-Agent': 'Request-Promise',
			},
		};

		Object.assign(this.httpOptions, options, { baseUrl: MarketMethod.CommunityMarketURL });

		this.request = request.defaults(this.httpOptions);

		return this;
	}

	setupParamsHandler(options, localization) {
		const newDefaultOptions = {};

		const marketMethod = Object.getPrototypeOf(this);

		Object.assign(newDefaultOptions, options, marketMethod.defaultParams || {});

		this.params = new ParamsHandler(options, localization);
	}

	getParams(params) {
		return this.params.get(params);
	}
}


module.exports = MarketMethod;

const request = require('request-promise');
const QueryParams = require('./QueryParams');


class MarketMethod {
	/**
	 * @constructor
	 * @param {Options} globalOptions
	 * @param {Object} methodOptions
	 */
	constructor(options) {
		// Maybe remove this
		this.options = options;

		this
			.setupRequestAgent()
			.setupParamsHandler(options);
	}

	get http() { return this.options.http; }

	setupRequestAgent() {
		this.request = request.defaults({
			// For some reason if its imported earlier it doesn't have the url
			// eslint-disable-next-line global-require
			baseUrl: require('./CommunityMarket').url,
			...this.options.http,
		});

		return this;
	}

	setupParamsHandler(options) {
		this.params = new QueryParams(options);
	}

	getParams(params) {
		return this.params.get(params);
	}
}


module.exports = MarketMethod;

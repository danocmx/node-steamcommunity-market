const QueryParams = require('./QueryParams');
const Request = require('./Request');


class MarketMethod {
	/**
	 * @constructor
	 * @param {Options} globalOptions
	 * @param {Object} methodOptions
	 */
	constructor(options) {
		this.options = options;

		this
			.setupRequestAgent()
			.setupParamsHandler(options);
	}

	get http() { return this.options.http; }

	setupRequestAgent() {
		const { globalOptions } = this.options;

		this.request = new Request({
			headers: globalOptions.HTTPheaders,
			rateLimit: globalOptions.rateLimit,
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

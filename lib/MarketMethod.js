const axios = require('axios');
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
		this.request = axios.create({
			// For some reason if its imported earlier it doesn't have the url
			// eslint-disable-next-line global-require
			baseURL: require('./CommunityMarket').url,
			headers: this.options.HTTPheaders,
			responseType: 'json',
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

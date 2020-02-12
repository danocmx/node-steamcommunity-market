const request = require('request-promise');


class MarketMethod {
	static get baseURL() { return 'https://steamcommunity.com/'; }

	constructor(options) {
		this.setupHTTP(options);
	}

	setupHTTP(options) {
		this.httpOptions = {
			headers: {
				'User-Agent': 'Request-Promise',
			},
		};

		Object.assign(this.httpOptions, options);
		Object.assign(this.httpOptions, { baseUrl: MarketMethod.CommunityMarketURL });

		this.request = request.defaults(this.httpOptions);
	}
}


module.exports = MarketMethod;

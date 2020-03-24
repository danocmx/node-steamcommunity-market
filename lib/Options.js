class Options {
	constructor({ http = {}, localization = {} }) {
		this.HTTPheaders = {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
			Cookies: '',
		};

		this.rateLimit = {};

		// Default localization
		this.localization = {
			currency: 1,
			country: 'us',
			language: 'en',
		};

		this
			.setupHTTP(http)
			.setupLocalization(localization);
	}

	setupHTTP({ headers = {}, rateLimit = {} }) {
		Object.assign(this.HTTPheaders, headers);
		Object.assign(this.rateLimit, rateLimit);

		return this;
	}

	setupLocalization(localization) {
		Object.assign(this.localization, localization);
	}
}


module.exports = Options;

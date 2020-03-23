class Options {
	constructor({ HTTPheaders = {}, localization = {} }) {
		// We only allow you to work with headers
		this.HTTPheaders = {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
			Cookies: '',
		};

		// Default localization
		this.localization = {
			currency: 1,
			country: 'us',
			language: 'en',
		};

		this
			.setupHTTP(HTTPheaders)
			.setupLocalization(localization);
	}

	setupHTTP(headers) {
		Object.assign(this.HTTPheaders, headers);

		return this;
	}

	setupLocalization(localization) {
		Object.assign(this.localization, localization);
	}
}


module.exports = Options;

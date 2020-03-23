class Options {
	constructor({ http = {}, localization = {} }) {
		// Default http options, we only set headers & cookies, nothing else is necessery
		this.http = {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
			},
			cookies: {},
		};

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

	setupHTTP(http) {
		const { cookies = {}, headers = {} } = http;

		Object.assign(this.http.cookies, cookies);
		Object.assign(this.http.headers, headers);

		return this;
	}

	setupLocalization(localization) {
		Object.assign(this.localization, localization);
	}
}


module.exports = Options;

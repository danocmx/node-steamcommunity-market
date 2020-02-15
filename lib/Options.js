class Options {
	constructor(options) {
		this.http = {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
			},
			cookies: {},
		};

		this.localization = {
			currency: 1,
			country: 'us',
			language: 'en',
		};

		this
			.setupHTTP(options)
			.setupLocalization(options);
	}

	setupHTTP({ http = {} }) {
		const { cookies = {}, headers = {} } = http;

		Object.assign(this.http.cookies, cookies);
		Object.assign(this.http.headers, headers);

		return this;
	}

	setupLocalization({ localization = {} }) {
		Object.assign(this.localization, localization);
	}
}


module.exports = Options;

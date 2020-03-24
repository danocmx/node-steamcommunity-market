const axios = require('axios');
const _ = require('lodash');

const parseCookieString = require('./Request/parseCookieString');
const parseCookieArray = require('./Request/parseCookieArray');


class Request {
	/**
	 * @constructor
	 * @param {object} [options={}] http options
	 */
	constructor({ headers, rateLimit }) {
		this.headers = headers;

		this.jar = {};

		if (this.headers.Cookies) {
			this.setCookies(this.headers.Cookies);
			delete this.headers.Cookies;
		}

		this.rateLimit = rateLimit;

		this.request = axios.create({
			// eslint-disable-next-line global-require
			baseURL: require('./CommunityMarket').url,
			responseType: 'json',
		});
	}

	/**
	 * Sets cookies based off the input
	 * @param {string|array[string]} cookies
	 */
	setCookies(cookies) {
		this.jar = typeof cookies === 'string'
			? parseCookieString(cookies)
			: parseCookieArray(cookies);
	}

	/**
	 * Main request function
	 * @param {string} endpoint
	 * @param {object} param
	 */
	send(method, endpoint, params) {
		const options = this.createOptions(method, params);

		return this.request(endpoint, options);
	}

	/**
	 * Creates request options
	 * @param {string} method http method
	 * @param {object} params query string params
	 * @return {object} options
	 */
	createOptions(method, params) {
		const headers = { ...this.headers };

		if (!_.isEmpty(this.jar)) {
			headers.Cookies = this.getCookiesString();
		}

		return {
			method,
			headers,
			params,
		};
	}

	/**
	 * Takes cookie jar and makes string out of it
	 * @return {string} cookie string
	 */
	getCookiesString() {
		const cookies = [];

		Object.keys(this.jar).forEach((name) => {
			cookies.push(`${name}=${this.jar[name]}`);
		});

		return cookies.join('; ');
	}
}


module.exports = Request;

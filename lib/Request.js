const axios = require('axios');


class Request {
	// Cookies
	// Headers
	// Axios
	// bottleneck
	// ratelimits
	constructor(options = {}) {
		const { headers = {}, rateLimit = {} } = options;

		this.jar = {};
	}
}


module.exports = Request;

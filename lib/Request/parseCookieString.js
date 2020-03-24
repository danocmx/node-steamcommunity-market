const parseCookieArray = require('./parseCookieArray');

module.exports = function(string) {
	const cookies = string.split(';').map((cookie) => cookie.trim());

	return parseCookieArray(cookies);
};

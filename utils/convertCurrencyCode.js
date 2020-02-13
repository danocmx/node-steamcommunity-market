const ECMCurrencyCodes = require('../resources/ECMCurrencyCodes');
const ECMCurrencyPrefixes = require('../resources/ECMCurrencyPrefixes');
const ECMCurrencySuffixes = require('../resources/ECMCurrencySuffixes');


/**
 * Converts currency code (1) into a currency sign ($)
 * @param {ECMCurrencyCodes} code
 */
module.exports = function convertCurrencyCode(code) {
	const text = ECMCurrencyCodes[code];
	return { prefix: ECMCurrencyPrefixes[text] || '', suffix: ECMCurrencySuffixes[text] || '' };
};

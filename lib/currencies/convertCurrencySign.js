const ECMCurrencyCodes = require('../../resources/ECMCurrencyCodes');
const ECMCurrencySigns = require('../../resources/ECMCurrencySigns');


/**
 * Converts currency sign -prefix or suffix- ($) into a currency code (1)
 * @param {String} prefix
 * @param {String} suffix
 */
module.exports = function convertCurrencySign(prefix, suffix) {
	const fix = prefix || suffix;
	return ECMCurrencyCodes[
		ECMCurrencySigns[fix]
	];
};

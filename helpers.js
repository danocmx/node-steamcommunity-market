const { ECMCurrencySigns, ECMCurrencyCodes } = require("./resources/ECMCurrencies");

/**
 * Parses the currency text
 * @param {String} currencyText from the search render
 * @return {Object} prefix & suffix & price
 */
function parseCurrencyText(currencyText) {
    const match = currencyText.match(/([^0-9]*)(\d+[,.]?\d*)([^0-9]*)/) || [];
    return { prefix: match[1], suffix: match[3], price: parseFloat(match[2] || 0) };
}

/**
 * Converts currency sign -prefix or suffix- ($) into a currency code (1)
 * @param {String} prefix 
 * @param {String} suffix 
 */
function convertCurrencySign(prefix, suffix) {
    const fix = prefix || suffix;
    return ECMCurrencyCodes[ ECMCurrencySigns[fix] ];
}

/**
 * Converts currency code (1) into a currency sign ($)
 * @param {ECMCurrencyCodes} code 
 */
function convertCurrencyCode(code) {
    const text = ECMCurrencyCodes[code];
    return { prefix: ECMCurrencyPrefixes[text] || "", suffix: ECMCurrencySuffixes[text] || "" };
}

/**
 * Contructs price with prefix & suffix
 * @param {Number} price 
 * @return {String} Price with prefix and/or suffix 
 */
function getPriceToString(price) {
    if (this.prefix) price = this.prefix + price;
    if (this.suffix) price += this.suffix;
    return price;
}

/**
 * @package
 */
module.exports = {
    parseCurrencyText   : parseCurrencyText,
    convertCurrencySign : convertCurrencySign,
    convertCurrencyCode : convertCurrencyCode,
    getPriceToString    : getPriceToString 
}
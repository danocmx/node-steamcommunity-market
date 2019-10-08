const { ECMCurrencySigns, ECMCurrencyCodes } = require("./resources")

/**
 * Parses the currency text
 * @param {String} currencyText from the search render
 * @return {Object} prefix & suffix & price
 */
function parseCurrencyText(currencyText) {
    const match = currencyText.match(/([^0-9]*)(\d+[,.]?\d*)([^0-9]*)/) || [];
    return { prefix: match[1], suffix: match[3], price: parseFloat(match[2]) };
}

function convertCurrencySign(prefix, suffix) {
    const fix = prefix || suffix;
    return ECMCurrencyCodes[ ECMCurrencySigns[fix] ];
}

module.exports = {
    parseCurrencyText   : parseCurrencyText,
    convertCurrencySign : convertCurrencySign
}
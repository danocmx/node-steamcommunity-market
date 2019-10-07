/**
 * Parses the currency text
 * @param {String} currencyText from the search render
 * @return {Object} prefix & suffix & price
 */
function parseCurrencyText(currencyText) {
    const match = currencyText.match(/([^0-9]*)(\d+[,.]?\d*)([^0-9]*)/) || [];
    return { prefix: match[1], suffix: match[3], price: parseFloat(match[2]) };
}

module.exports = {
    parseCurrencyText: parseCurrencyText
}
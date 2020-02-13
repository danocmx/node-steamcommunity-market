/**
 * Converts weird currency format to the normal one
 * @param {Number} currency 2xxx currency format
 * @return {Number} xxx currency format
 */
module.exports = function getNormalCurrencyFormat(currency) {
	return parseInt((`${currency}`).substr(1));
};

/**
 * Maps raw orders to price, amount
 * @param {[number, number, string]} orders raw orders
 * @return {number[][]} price, amount
 */
module.exports = function(orders) {
	return orders.map((order) => [order[0], order[1]]);
};

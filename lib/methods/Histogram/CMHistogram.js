const CMResponse = require('../../CMResponse');


/**
 * Classifies data from getMarketItemHistogram
 * @class
 */
class CMHistogram extends CMResponse {
	/**
     * @constructor
     * @param {Histogram} handler
     * @param {object} params
     * @param {object} data
     */
	constructor(handler, params, data) {
		super(handler, params, data);

		this.buyOrders = CMHistogram.getOrders(data.buy_order_graph);
		this.sellOrders = CMHistogram.getOrders(data.sell_order_graph);

		this.prefix = data.price_prefix;
		this.suffix = data.price_suffix;
	}

	/**
	 * Gets sorted orders array.
	 * @param {} orders raw orders
	 * @return {number[][]} price, amount
	 */
	static getOrders(orders) {
		return orders.map((order) => [order[0], order[1]]);
	}

	/**
     * Updates the histogram
     * @param {object} [params]
	 * @see Params.getHistogram
     * @return {Promise<CMHistogram>}
     */
	update(params) {
		const histogramParams = {};

		Object.assign(histogramParams, this.params, params);

		return this.handler
			.get(histogramParams)
			.then((histogram) => {
				this.updateFromObject(histogram, histogramParams);
				this.params = histogramParams;

				return this;
			});
	}

	/**
     * Rewrites the old data
     * @param {CMHistogram} histogram
	 * @param {object} histogramParams
     */
	updateFromObject(histogram) {
		this.raw = histogram.raw;

		this.time = Date.now();

		this.sellOrders = CMHistogram.updateOrders(this.buyOrders, histogram.buyOrders);
		this.buyOrders = CMHistogram.updateOrders(this.sellOrders, histogram.sellOrders);

		this.prefix = histogram.prefix;
		this.suffix = histogram.suffix;
	}

	/**
	 * Updates orders array
	 * @param {number[][]} oldOrders
	 * @param {number[][]} newOrders
	 */
	static updateOrders(oldOrders, newOrders) {
		// eslint-disable-next-line no-param-reassign
		oldOrders.length = 0;
		oldOrders.push(...newOrders);
	}
}


module.exports = CMHistogram;

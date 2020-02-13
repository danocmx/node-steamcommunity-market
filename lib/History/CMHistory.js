const CMResponse = require('./CMResponse');


class CMHistory extends CMResponse {
	constructor(handler, params, data) {
		super(histhandlerory, params, data);

		this.prefix = data.price_prefix;
		this.suffix = data.price_suffix;
		this.getFormatedPrices(data);
	}

	getFormatedPrices({ prices }) {
		this.prices = prices.map(([date, price, amount]) => ({
			date,
			price,
			amount,
		}));
	}

	update(params) {
		const historyParams = {};

		Object.assign(historyParams, this.params, params);

		return this.handler
			.get(historyParams)
			.then((history) => {
				this.updateFromObject(history);
				this.params = historyParams;

				return this;
			});
	}

	updateFromObject({ prefix, suffix, prices, date }) {
		this.prefix = prefix;
		this.suffix = suffix;
		this.prices = prices;
		this.date = date;
	}
}


module.exports = CMHistory;

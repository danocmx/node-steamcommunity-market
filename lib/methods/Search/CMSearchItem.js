const convertCurrencySign = require('../../currencies/convertCurrencySign');
const parseCurrencyText = require('../../currencies/parseCurrencyText');


/**
 * Classifies search data
 * @class
 */
class CMSearchItem {
	/**
     * @constructor
     * @param {Object} searchItem JSON response from the API
     * @param {Number} time Time when we searched for the item
     */
	constructor(searchItem, time) {
		this.time = time;

		this.name = searchItem.name;
		this.marketHashName = searchItem.hash_name;

		this.amount = searchItem.sell_listings;
		this.amountUpdated = true;
		this.price = searchItem.sell_price / 100;

		/* Gets the prefix and/or suffix */
		const parsedCurrencyText = parseCurrencyText(searchItem.sell_price_text);
		this.prefix = parsedCurrencyText.prefix;
		this.suffix = parsedCurrencyText.suffix;
		this.currency = convertCurrencySign(this.prefix, this.suffix);

		const assets = searchItem.asset_description;
		this.appid = assets.appid;
		this.classid = assets.classid;
		this.instanceid = assets.instanceid;
		this.type = assets.type;

		this.iconUrl = `https://steamcommunity-a.akamaihd.net/economy/image/${assets.icon_url}`;

		const salePriceMatch = parseCurrencyText(searchItem.sale_price_text);
		if (salePriceMatch.price) {
			this.sale = salePriceMatch.price;
		}

		this.tradable = assets.tradable;
		this.marketable = assets.marketable;
		this.descriptions = assets.descriptions;
		this.commodity = assets.commodity === 1;
		this.marketTradableRestriction = assets.market_tradable_restriction;
		this.marketMarketableRestriction = assets.market_marketable_restriction;

		// Country restriction
		this.marketBuyCountryRestriction = assets.market_buy_country_restriction || null;
	}
}


module.exports = CMSearchItem;

const getNormalCurrencyFormat = require('../../currencies/getNormalCurrencyFormat');


/**
 * Classifies scm listing data
 * @class CMListing
 */
class CMListing {
	/**
     * Just gives us the necessery info
     * @constructor
     * @param {object} asset        Asset data from API
     * @param {object} listinginfo  Currency & Price info from API
     * @param {number} time         Time when searched for this listing
     */
	constructor(asset, listinginfo, time) {
		this.time = time;

		this.appid = asset.appid;
		this.name = asset.name;
		this.marketName = asset.market_name;
		this.marketHashName = asset.market_hash_name;
		this.type = asset.type;
		this.id = asset.id;
		this.classid = asset.classid;
		this.instanceid = asset.instanceid;
		this.amount = asset.amount;
		this.iconUrl = asset.icon_url;
		this.descriptions = asset.descriptions;
		this.actions = asset.actions;
		this.commodity = asset.commodity;

		this.actions = asset.actions;
		this.marketActions = asset.market_actions;

		this.tradable = asset.tradable;
		this.marketable = asset.marketable;
		this.marketTradableRestriction = asset.market_tradable_restriction || 0;
		this.marketMarketableRestriction = asset.market_marketable_restriction || 0;
		this.marketBuyCountryRestriction = asset.market_buy_country_restriction || null;

		this.listingid = listinginfo.listingid;

		this.oPrice = listinginfo.price;
		this.oFee = listinginfo.fee;
		this.oCurrency = getNormalCurrencyFormat(listinginfo.currency_id);

		this.steamFee = listinginfo.steam_fee;
		this.publisherFee = listinginfo.publisher_fee;
		this.publisherFeePercent = listinginfo.publisher_fee_percent;

		this.convertedPrice = listinginfo.converted_price;
		this.convertedFee = listinginfo.converted_fee;
		this.convertedCurrency = getNormalCurrencyFormat(listinginfo.converted_currencyid);

		this.convertedSteamFee = listinginfo.converted_steam_fee;
		this.convertedPublisherFee = listinginfo.converted_publisher_fee;
		this.convertedPricePerUnit = listinginfo.converted_price_per_unit;
		this.convertedFeePerUnit = listinginfo.converted_fee_per_unit;
		this.convertedSteamFeePerUnit = listinginfo.converted_steam_fee_per_unit;
		this.convertedPublisherFeePerUnit = listinginfo.converted_publisher_fee_per_unit;
	}

	get price() {
		return this.convertedPrice || this.oPrice;
	}

	get fullPrice() {
		return this.price + this.fee;
	}

	get fee() {
		return this.convertedFee || this.oFee;
	}

	get currency() {
		return this.convertedCurrency || this.oCurrency;
	}
}


module.exports = CMListing;

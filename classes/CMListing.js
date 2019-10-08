const request = require("../request");
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");

/**
 * Gets listings from scm, only includes sellOrders and is descriptive
 * @param {Number} appid            Steam AppID
 * @param {String} item             Market Hash Name
 * @param {Number} params.start     From which listings search starts
 * @param {Number} params.count     How many listings we want (Amount)
 * @param {Number} params.currency  ECMCurrencyCodes code
 * @param {String} params.language  Language code
 * @param {String} params.country   Country code
 * @param {String} params.query     Search query
 * @param {function (err, listings)} [callback]
 * @return {Promise<[CEconListingItem]>}
 */
const getMarketItemListings = function(appid, item, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = null;
    }
    
    return new Promise((resolve, reject) => {
        item = encodeURIComponent(item);

        params = params || {}
        const qs = {
            start   : params.start || 0,
            count   : params.count || undefined,
            country : params.country || "us",
            language: params.language || "en",
            currency: params.currency || ECMCurrencyCodes.USD,
            query   : params.query || undefined
        }

        request("GET", `listings/${appid}/${item}/render`, { json: true, gzip: true, qs: qs }, (err, response) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }

            const listings = sortListings(response);
            if (listings.length < 1) {
                const noListingsError = new Error("No listings were found.");
                noListingsError.code = "NO_LISTINGS_FOUND";
                callback && callback(noListingsError);
                reject(noListingsError);
                return;
            }

            callback && callback(null, listings);
            resolve( listings );
        })
    })
}

/**
 * Sorts listings in a better manner in one object
 * @param {Object} param0.assets        Steam asset object we receive from their API's
 * @param {Object} param0.listinginfo   SCM listing info including all currency info
 * @return {Object}                     A CEconListingItem instance
 */
function sortListings({ assets, listinginfo }) {
    const listings = []
    for (let listingID in listinginfo) {
        if (!listinginfo.hasOwnProperty(listingID) || listingID === "purchaseinfo") continue;
        const listing = listinginfo[listingID];

        const { appid, contextid, id } = listing.asset;

        const asset = assets[appid][contextid][id];
        listings.push(new CMListing(asset, listing) );
    }

    return listings;
}

/**
 * Classifies scm listing data
 * @class CMListing
 */
class CMListing {
    /**
     * Just gives us the necessery info
     * @param {Object} asset         Asset data
     * @param {Object} listinginfo   Currency & Price info
     */
    constructor(asset, listinginfo) {
        /* Asset info */
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
        /* Actions */
        this.actions = asset.actions;
        this.marketActions = asset.market_actions;
        /* Market properties */
        this.tradable = asset.tradable;
        this.marketable = asset.marketable;
        this.marketTradableRestriction = asset["market_tradable_restriction"] || 0
        this.marketMarketableRestriction = asset["market_marketable_restriction"] || 0
        this.marketBuyCountryRestriction = asset["market_buy_country_restriction"] || null;
        /* Currency & Price info */
        this.listingid = listinginfo.listingid;
        
        const fee = listinginfo["converted_fee"] || listinginfo.fee;
        const price = listinginfo["converted_price"] || listinginfo.price;
        this.fee = fee / 100;
        this.price = (price + fee) / 100;
        
        this.currency = parseInt(((listinginfo["converted_currencyid"] || listinginfo.currencyid) + "").substr(1));
    }
}

/**
 * @package
 */
module.exports = {
    CMListing               : CMListing,
    getMarketItemListings   : getMarketItemListings,
    sortListings            : sortListings,
};

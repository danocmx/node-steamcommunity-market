const request = require("../request");
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");

/**
 * Gets descriptive sellOrders from SCM
 * @param {Number} appid                            Steam AppID
 * @param {String} marketHashName                             
 * @param {Object} [params]                         Query string parameters
 * @param {Number} [params.start=0]                 From which listings search starts
 * @param {Number} [params.count]                   How many listings we want (Amount)
 * @param {ECMCurrencyCodes} [params.currency=USD]  ECMCurrencyCodes code
 * @param {String} [params.language="english"]      Language name
 * @param {String} [params.country="us"]            Country code
 * @param {String} [params.query]                   Search query
 * @param {function (Error, CMListing[])} [callback]
 * @return {Promise<CMListing[]>}
 */
const getMarketItemListings = function(appid, marketHashName, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = null;
    }
    
    return new Promise((resolve, reject) => {
        marketHashName = encodeURIComponent(marketHashName);

        /* Default values */
        params = { ...params } || {}
        params.start = params.start || 0;
        params.country = params.country || "us";
        params.language = params.language || "english";
        params.currency = params.currency || ECMCurrencyCodes.USD;
        params.query = params.query || undefined;

        /* Indicates if we want to loop */
        let fetchMore;
        if (params.count > 100) fetchMore = parseInt(params.count);
        else if (params.count == undefined) fetchMore = true;
        else fetchMore = false;
        params.count = fetchMore ? 100 : params.count;

        getMarketItemListingsCallback(appid, marketHashName, params, fetchMore, (err, listings) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }

            callback && callback(null, listings);
            resolve(listings);
        });
    })
}

/**
 * Callback version of getMarketItemListings for the purpose of looping
 * @private
 * @see getMarketItemListings
 */
function getMarketItemListingsCallback(appid, marketHashName, qs, fetchMore, callback, listings) {
    /* Adds the start to fetchMore so we get the actual amount */
    if (!listings && fetchMore == "number") {
        fetchMore += qs.start;
    }

    request("GET", `listings/${appid}/${marketHashName}/render`, { json: true, gzip: true, qs: qs }, (err, { listinginfo, assets, pagesize, total_count }) => {
        if (err) {
            callback(err);
            return;
        }

        /* Pushes listings to the listings array */
        listings = listings || [];
        for (let listingID in listinginfo) {
            if (!listinginfo.hasOwnProperty(listingID) || listingID === "purchaseinfo") continue;
            const listing = listinginfo[listingID];
    
            const { appid, contextid, id } = listing.asset;
    
            const asset = assets[appid][contextid][id];
            listings.push(new CMListing(asset, listing) );
        }

        /* Checks how many more do we need to search for */
        const celling = typeof fetchMore == "number" && fetchMore < total_count ? fetchMore : total_count;
        pagesize = parseInt(pagesize);
        if ((qs.start + pagesize < celling) && fetchMore) {
            
            qs.start += pagesize;                               // Current amount
            const toSearchFor = celling - qs.start;             // How many are we missing
            qs.count = toSearchFor < 100 ? toSearchFor : 100;   // How many are we searching for

            /* Watch for callstackExceededError */
            getMarketItemListingsCallback(appid, marketHashName, qs, fetchMore, callback, listings);
            return;
        }

        /* If there are no listings we throw an Error */
        if (listings.length < 1) {
            callback(new Error("No listings were found."));
            return;
        }

        callback(null, listings);
    })
}

/**
 * Classifies scm listing data
 * @class CMListing
 */
class CMListing {
    
    /**
     * Just gives us the necessery info
     * @constructor
     * @param {Object} asset         Asset data from API
     * @param {Object} listinginfo   Currency & Price info from API
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
    getMarketItemListings   : getMarketItemListings
};

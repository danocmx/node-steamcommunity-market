const cheerio = require("cheerio");
const request = require("../request");
const getMarketItemListings =  require("./CMListing").getMarketItemListings;
const getMarketItemHistogram = require("./CMHistogram").getMarketItemHistogram;
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");

/**
 * Gets the basic market item page
 * @param {Number} appid                            Steam AppID
 * @param {String} marketHashName                             
 * @param {Object} [params]                         Parameters for the request
 * @param {String} [params.query]                   Query search for the item
 * @param {ECMCurrencyCodes} [params.currency=USD] 
 * @param {String} [params.language="english"] 
 * @param {String} [params.country="us"]
 * @param {function(Error, CMarketItem)} [callback]
 * @return {Promise<CMarketItem>}
 */
const getMarketItemPage = function(appid, marketHashName, params, callback) {
    if (typeof params == "function") {
        callback = params;
        params = null;
    }

    return new Promise((resolve, reject) => {
        params = { ...params } || {}
        params.query = params.query || undefined;
        
        request("GET", `listings/${appid}/${encodeURIComponent(marketHashName)}`, { qs: { filter: params.query } }, (err, html) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }
            const $ = cheerio.load(html);

            /* Looks if we have found any listings. Not sure if we should keep this, will do futher tests. */
            if ($(".market_listing_table_message").text().indexOf("There are no listings for this item.") !== -1) {
                reject(new Error("Item not found."));
                return;
            }

            const Item = new CMItem($, html, appid, marketHashName, params);
            /* Better way to accurately get the listings, calls other APIs */
            Item.update(error => {
                if (error) {
                    callback && callback(error);
                    reject(error);
                    return;
                }

                callback && callback(null, Item);
                resolve(Item);
            })
        })
    })
}

/**
 * Stores all info about community market item
 * @class CMItem
 */
class CMItem {
    
    /**
     * Scrapes the data and saves into the object
     * @param {Object} $                cheerio.load instance 
     * @param {String} body             HTML
     * @param {Number} appid            Steam appid
     * @param {String} marketHashName             
     * @param {Object} params           From getMarketItemPage 
     */
    constructor($, body, appid, marketHashName, params) {
        this.time = Date.now();

        this.appid = appid;
        this.marketHashName = marketHashName;
        this.params = params;
        
        /* Searches for the item image*/
        this.image = $(".market_listing_largeimage > img").attr("src");
        
        /* Checks if item is commodity, meaning all instances of this item are the same */
        this.commodity = false;
        if ($(".market_commodity_order_block").length > 0) {
            this.commodity = true;
        }  

        /* CommodityID is included for other items too */
        let commodityIDMatch = body.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\)/);
        if (commodityIDMatch) {
            this.commodityID = parseFloat(commodityIDMatch[1]);
        }

        /* Sales of the item */
        this.sales = [];
        let salesMatch = body.match(/var line1=([^;]+);/);
        if (salesMatch) {
            this.sales = eval(salesMatch[1]).map(sale => [ Date.parse(sale[0]), sale[1], parseInt(sale[2]) ]);
        }

        /* Getting the language string for update options, defaults to this.params.language */
        if (!params.hasOwnProperty("language")) { 
            let languageMatch = body.match(/var g_strLanguage = "(\w+)"/);
            if (languageMatch) {
                this.params.language = languageMatch[1];
            }
        }
        /* Getting the country code for update options, defaults to this.params.country */
        if (!params.hasOwnProperty("country")) {
            let countryMatch = body.match(/var g_strCountryCode = "(\w+)"/);
            if (countryMatch) {
                this.params.country = countryMatch[1];
            }
        }

        /* Update method */
        this.histogram = null;  // Histogram instance
        this.listings = [];     // Item Listings
    }

    get sellOrders() {
        return this.histogram ? this.histogram.sellOrders : null;
    }

    get buyOrders() {
        return this.histogram ? this.histogram.buyOrders : null;
    }

    /**
     * Updates the price for the item, update params property to update the item by those
     * @param {Object} params                       Same as getMarketItemPage
     * @param {function(err, result)} [callback]    Either CMHistogramResults or Array made of CEconListingItem
     * @return {Promise.<Result>}  
     */
    update(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        return (this.commodity ? this.getHistogram() : this.getListings())
            .then(() => {
                this.time = Date.now();

                /* Updates the parameters */
                if (params) {
                    this.params = params;
                }

                callback && callback(null, this);
                return this;
            })
            .catch(err => {
                callback && callback(err);
                return Promise.reject(err);
            })
    }

    /**
     * Gets histogram for commodity item
     * @private
     * @return {Promise<CMHistogram>}
     */
    getHistogram() {
        const setHistogram = !this.histogram;
        return (this.histogram ? this.histogram.update() : getMarketItemHistogram(this.commodityID, this.params))
            .then(histogram => {                
                if (setHistogram) this.histogram = histogram;

                return this.histogram;
            })
    }

    /**
     * Gets listings for item
     * @private
     * @return {Promise<CMListing[]>}
     */
    getListings() {
        return getMarketItemListings(this.appid, this.marketHashName, this.params)
            .then(listings => {
                this.listings.length = 0;
                this.listings.push(...listings);
                
                return this.listings;
            })
    }
}

/**
 * @package
 */
module.exports = {
    CMItem              : CMItem,
    getMarketItemPage   : getMarketItemPage
};
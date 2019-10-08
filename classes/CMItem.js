const cheerio = require("cheerio");
const request = require("../request");
const getMarketItemListings =  require("./CMListing").getMarketItemListings;
const getMarketItemHistogram = require("./CMHistogram").getMarketItemHistogram;
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");

/**
 * Gets the basic market item page
 * @param {Number} appid    Steam AppID
 * @param {String} item     Market Hash Name
 * @param {String} params   
 * @param {function(err, CMarketItem)} [callback]
 * @return {Promise<CMarketItem>}
 */
const getMarketItemPage = function(appid, item, params, callback) {
    if (typeof params == "function") {
        callback = params;
        params = null;
    }

    return new Promise((resolve, reject) => {
        params = params || {}
        params.query = params.query || undefined;
        params.currency = params.currency || ECMCurrencyCodes.USD
        
        request("GET", `listings/${appid}/${encodeURIComponent(item)}`, { qs: { filter: params.query } }, (err, html) => {
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

            const Item = new CMItem($, html, appid, item, params);
            /* Will keep updating until I can find a reliable way to convert any currency */
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
     * @param {String} item             Market hash name
     * @param {String} params.filter    Query for descriptions, etc... 
     */
    constructor($, body, appid, item, params) {
        this.appid = appid;
        this.item = item;
        this.params = params;
        /* Image jQuery search */
        this.img = $(".market_listing_largeimage > img").attr("src") || null;
        /* Getting the currency code, change the currency code for update to update to it */
        this.currency = params.currency;
        /* Getting the language string for update options */
        let languageMatch = body.match(/var g_strLanguage = "(\w+)"/);
        if (languageMatch) {
            this.language = languageMatch[1];
        }
        /* Getting the country code for update options */
        let countryMatch = body.match(/var g_strCountryCode = "(\w+)"/);
        if (countryMatch) {
            this.country = countryMatch[1];
        }
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

        this.histogram = null;
        this.listings = [];
        this.sellOrders = [];
        this.buyOrders = [];
    }

    /**
     * Updates the price for the item
     * @param {function(err, result)} [callback] Either CMHistogramResults or Array made of CEconListingItem
     * @return {Promise.<Result>}  
     */
    update(callback) {
        return (this.commodity ? this.updatePriceForCommodity() : this.updatePriceForNonCommodity())
            .then(() => {
                callback && callback(null, this);
                return this;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    updatePriceForCommodity() {
        return getMarketItemHistogram({
            item_nameid : this.commodityID,
            currency    : this.currency,
            language    : this.language,
            country     : this.country
        })
            .then(histogram => {
                this.buyOrders = histogram.buyOrders;
                this.sellOrders = histogram.sellOrders;
                
                this.histogram = histogram;

                return this;
            })
    }

    updatePriceForNonCommodity() {
        return getMarketItemListings(this.appid, this.item, {
            country : this.country,
            language: this.language,
            currency: this.currency            
        })
            .then(listings => {
                this.listings = listings;
                
                return this;
            })
    }
}

module.exports = {
    CMItem              : CMItem,
    getMarketItemPage   : getMarketItemPage
};
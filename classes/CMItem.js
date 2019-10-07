const cheerio = require("cheerio");
const request = require("../request");
const { sortListings, getMarketItemListings } =  require("./CMListing");
const { getMarketItemHistogram } = require("./CMHistogram");

/**
 * Gets the basic market item page
 * @param {Number} appid    Steam AppID
 * @param {String} item     Market Hash Name
 * @param {String} query    Query search
 * @param {function(err, CMarketItem)} [callback]
 * @return {Promise<CMarketItem>}
 */
const getMarketItemPage = function(appid, item, query, callback) {
    if (typeof query == "function") {
        callback = query;
        query = undefined;
    }

    return new Promise((resolve, reject) => {
        request("GET", `listings/${appid}/${encodeURIComponent(item)}`, { qs: { filter: query } }, (err, html) => {
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

            const Item = new CMItem($, html, appid, item, query);
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
    constructor($, body, appid, item, query) {
        this.appid = appid;
        this.item = item;
        this.query = query;
        /* Image jQuery search */
        this.img = $(".market_listing_largeimage > img").attr("src") || null;
        /* Getting the currency code, change the currency code for update to update to it */
        let currencyMatch = body.match(/oParams.currency = '(\d+)';/);
        if (currencyMatch) {
            this.currency = parseInt(currencyMatch[0]);
            this.currency = isNaN(this.currency) ? null : this.currency;
        }
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
        /* CommodityID is included for other items too */
        let commodityIDMatch = body.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\)/);
        if (commodityIDMatch) {
            this.commodityID = parseFloat(commodityIDMatch[1]);
        }
        /* Checks if item is commodity, meaning all instances of this item are the same */
        this.commodity = false;
        if ($(".market_commodity_order_block").length > 0) {
            this.commodity = true;
        }  
        /* Sales of the item */
        this.sales = [];
        let salesMatch = body.match(/var line1=([^;]+);/);
        if (salesMatch) {
            this.sales = eval(salesMatch[1]).map(sale => [ Date.parse(sale[0]), sale[1], parseInt(sale[2]) ]);
        }
        /* Commodity check */
        if (this.commodity === false) {
            /* Item assets */
            let g_rgAssets = {}
            let assetsMatch = body.match(/var g_rgAssets = ([^;]+);/);
            if (assetsMatch) {
                g_rgAssets = JSON.parse(assetsMatch[1]);
            }
            /* Listing info containing currencies and prices */
            let g_rgListingInfo = {}
            let listinginfoMatch = body.match(/var g_rgListingInfo = ([^;]+);/);
            if (listinginfoMatch) {
                g_rgListingInfo = JSON.parse(listinginfoMatch[1]);
            }
            /* Sorted by helper function SortListings, documented in its import file */
            this.listings = sortListings({ assets: g_rgAssets, listinginfo: g_rgListingInfo });
        } else {
            /* We have to get the buyOrders using the update method */
            this.buyOrders = [];
            this.sellOrders = [];

            this.histogram = null;
        }
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
const request = require("../request");
const getMarketItemPage = require("./CMItem").getMarketItemPage;
const getMarketItemOverview = require("./CMOverview").getMarketItemOverview;
const getMarketItemListings = require("./CMListing").getMarketItemListings;
const getMarketItemHistogram = require("./CMHistogram").getMarketItemHistogram;
const { parseCurrencyText } = require("../helpers");

/**
 * Searches the community market
 * @param {String} params.query         Name Query
 * @param {Number} params.appid 
 * @param {Boolean} params.searchDescriptions 
 * @param {Number} params.start         From which block do we start
 * @param {Number} params.count         How many search blocks we receive
 * @param {String} params.sortColumn    `quantity`, `price`, `name` which column the search sorts by
 * @param {String} params.sortDir       `acs`, `desc` directory of sorting
 * @param {function(err, [CMSearchItem])} [callback] 
 */
function searchMarket(params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = null;
    }

    /* Default values */
    params = params || {}
    const qs = {}
    qs.query = params.query || null;
    qs.appid = params.appid;
    qs.search_descriptions = params.searchDescriptions ? 1 : 0;
    qs.start = params.start || 0;
    qs.count = params.count || 100;
    qs.sort_column = params.sortColumn || 'price';  // We really want to default sort by price
    qs.sort_dir = params.sortDir || 'asc';          // Ascending
    qs.norender = 1                                 // Only norener to html

    /* We're giving right format to the custom appid params */
    if (qs.appid) {
        for (let param in params) {
            // Just excluding already known properties
            if (["query", "appid", "searchDescriptions", "start", "count", "sortColumn", "sortDir"].includes(param)) continue;
            qs[`category_${qs.appid}_${param}[]`] = `tag_${params[param]}`;
        }
    }

    return new Promise((resolve, reject) => {
        request("GET", "search/render", { json: true, gzip: true, qs: qs }, (err, search) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }

            /* Using CMSearchItem object */
            const searchResults = [];
            for (let i = 0; i < search.results.length; i++) {
                searchResults.push( new CMSearchItem(search.results[i], qs) );
            }

            callback && callback(null, searchResults);
            resolve( searchResults );
        })
    })
}

/**
 * Classifies search data
 * @class CMSearchItem
 */
class CMSearchItem {
    /**
     * Classifies search data
     * @param {Object} searchItem JSON response from the API
     */
    constructor(searchItem, qs) {
        /* They should be fairly the same */
        this.name = searchItem.name;
        this.hashName = searchItem.hash_name;
        /* Amount & Price */
        this.amount = searchItem["sell_listings"];
        this.price = searchItem["sell_price"];
        /* Gets the prefix and/or suffix */
        const parsedCurrencyText = parseCurrencyText(searchItem.sell_price_text)
        this.prefix = parsedCurrencyText.prefix;
        this.suffix = parsedCurrencyText.suffix;
        /* Assets */
        const assets = searchItem["asset_description"];
        this.appid = assets.appid;
        this.classid = assets.classid;
        this.instanceid = assets.instanceid;
        this.descriptions = assets.descriptions;
        /* Icon URL */
        this.iconUrl = `https://steamcommunity-a.akamaihd.net/economy/image/${assets["icon_url"]}`;
        /* Market info */
        this.commodity = assets.commodity === 1 ? true : false;
        this.marketTradableRestriction = assets.market_tradable_restriction || 0;
        this.marketMarketableRestriction = assets.market_marketable_restriction || 0;
        this.marketable = assets.marketable;
        this.marketBuyCountryRestriction = assets.market_buy_country_restriction || null;
        /* Last sale info */
        const salePriceMatch = searchItem["sale_price_text"] ? searchItem["sale_price_text"].match(/\d+[,.]?\d*/) : null;
        if (salePriceMatch) {
            this.sale = parseFloat(salePriceMatch[0]);
        }

        this.qs = {}
        for (let param in qs) {
            if (!qs.hasOwnProperty(param)) continue;
            if (["query", "appid", "start", "count", "sort_column", "sort_dir", "norender"].includes(param)) continue;
            this.qs[param] = qs[param];
        }

        /* For CM's */
        this.page = null;
        this.overview = null;
        this.listings = null;
        this.histogram = null;
    }

    updateSearchNode(callback) {
        const qs = {
            query: this.name,
            appid: this.appid,
            count: 1,
            search_descriptions: this.qs.searchDescriptions,
            ...this.qs
        }
        delete qs.search_descriptions;

        return searchMarket(qs)
            .then(search => {
                const node = search[0];
                if (!node) {
                    return Promise.reject(new Error("Node was not found."));
                }
                
                this.price = node.price;
                this.amount = node.amount;
                this.prefix = node.prefix;
                this.suffix = node.suffix;
                this.classid = node.classid;
                this.instanceid = node.instanceid;
                this.descriptions = node.descriptions;
                this.marketTradableRestriction = node.marketTradableRestriction;
                this.marketMarketableRestriction = node.marketMarketableRestriction;
                this.marketable = node.marketable;
                this.marketBuyCountryRestriction = node.marketBuyCountryRestriction;
                this.sale = node.sale;

                callback && callback(null, this);
                return this;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    /**
     * Gets the page this search block belongs to
     * @param {function(err, CMPage)} [callback] 
     * @return {Promise<CMPage>}
     */
    getPage(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        return getMarketItemPage(this.appid, this.hashName, params)
            .then(page => {
                this.page = page;
                
                this.listings = page.listings;
                this.histogram = page.histogram;

                callback && callback(null, page);
                return page;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    getOverview(qs, callback) {
        if (typeof qs === "function") {
            callback = qs;
            qs = null;
        }

        return getMarketItemOverview(this.appid, this.hashName, qs)
            .then(overview => {
                this.overview = overview;

                callback && callback(null, overview);
                return overview;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    getListings(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        return getMarketItemListings(this.appid, this.hashName, params)
            .then(listings => {
                this.listings = listings;

                callback && callback(null, listings);
                return listings;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    getHistogram(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }
        
        if (!this.page || !this.page.commodityID) {
            return Promise.reject(new Error("No commodityID found."));
        }

        return getMarketItemHistogram(this.page.commodityID, params)
            .then(histogram => {
                this.histogram = histogram;

                callback && callback(null, histogram);
                return histogram;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }
}

module.exports = {
    CMSearchItem        : CMSearchItem,
    searchMarket        : searchMarket,
};

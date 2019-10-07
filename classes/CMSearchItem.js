const request = require("../request");
const Promises = require("@doctormckay/stdlib").Promises;
const getMarketItemPage = require("./CMItem");

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

    return Promises.callbackPromise([], callback, false, (accept, reject) => {
        request("GET", "search/render", { json: true, gzip: true, qs: qs }, (err, search) => {
            if (err) {
                reject(err);
                return;
            }

            /* Using CMSearchItem object */
            const searchResults = [];
            for (let i = 0; i < search.results.length; i++) {
                searchResults.push( new CMSearchItem(search.results[i]) );
            }

            accept( searchResults );
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
    constructor(searchItem) {
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
        /* For CMPage */
        this.page = null;
    }

    /**
     * Gets the page this search block belongs to
     * @param {function(err, CMPage)} [callback] 
     * @return {Promise<CMPage>}
     */
    getPage(callback) {
        return Promises.callbackPromise([], true, callback, (accept, reject) => {
            getMarketItemPage(this.appid, this.hashName, null, (err, item) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.page = item;
                accept(item);
            })
        })
    }

    getOverview() {

    }
}

/**
 * Parses the currency text
 * @param {String} currencyText from the search render
 * @return {Object} prefix & suffix & price
 */
function parseCurrencyText(currencyText) {
    const match = currencyText.match(/([^0-9]*)(\d+[,.]?\d)*([^0-9]*)/);
    return { prefix: match[1], suffix: match[3], price: parseFloat(match[2]) };
}

module.exports = {
    CMSearchItem        : CMSearchItem,
    searchMarket        : searchMarket,
    parseCurrencyText   : parseCurrencyText
};

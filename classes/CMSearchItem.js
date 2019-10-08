const request = require("../request");
const getMarketItemPage = require("./CMItem").getMarketItemPage;
const getMarketItemOverview = require("./CMOverview").getMarketItemOverview;
const getMarketItemListings = require("./CMListing").getMarketItemListings;
const getMarketItemHistogram = require("./CMHistogram").getMarketItemHistogram;
const { parseCurrencyText, convertCurrencySign } = require("../helpers");

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
    qs.count = params.count;
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
                searchResults.push( new CMSearchItem(search.results[i], params) );
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
    constructor(searchItem, params) {
        /* They should be fairly the same */
        this.name = searchItem.name;
        this.hashName = searchItem.hash_name;
        /* Amount & Price */
        this.amount = searchItem["sell_listings"];
        this.amountUpdated = true;
        this.price = searchItem["sell_price"] / 100;
        /* Gets the prefix and/or suffix */
        const parsedCurrencyText = parseCurrencyText(searchItem.sell_price_text)
        this.prefix = parsedCurrencyText.prefix;
        this.suffix = parsedCurrencyText.suffix;
        this.currency = convertCurrencySign(this.prefix, this.suffix);
        /* Assets */
        const assets = searchItem["asset_description"];
        this.appid = assets.appid;
        this.classid = assets.classid;          // Can be used in API call to steam
        this.instanceid = assets.instanceid;    // Usually 0
        
        this.type = assets.type;
        /* Icon URL */
        this.iconUrl = `https://steamcommunity-a.akamaihd.net/economy/image/${assets["icon_url"]}`;
        /* Last sale info */
        const salePriceMatch = searchItem["sale_price_text"] ? searchItem["sale_price_text"].match(/\d+[,.]?\d*/) : null;
        if (salePriceMatch) {
            this.sale = parseFloat(salePriceMatch[0]);
        }

        /* Saves query strings for other methods */
        this.params = params;

        /* Broad searches will give us all the info but searches with query will only give few */
        this.assetDescriptions = true
        this.old = false;

        this.tradable = assets.tradable;
        this.marketable = assets.marketable;
        this.descriptions = assets.descriptions;                                            // Item descriptions
        this.commodity = assets.commodity === 1 ? true : false;
        this.marketTradableRestriction = assets.market_tradable_restriction;
        this.marketMarketableRestriction = assets.market_marketable_restriction;
        this.marketBuyCountryRestriction = assets.market_buy_country_restriction || null;   // Country restriction
        if (!assets.hasOwnProperty("descriptions") || !assets.hasOwnProperty("commodity") || !assets.hasOwnProperty("market_tradable_restriction") || !assets.hasOwnProperty("market_marketable_restriction") || !assets.hasOwnProperty("marketable") || !assets.hasOwnProperty("market_buy_country_restriction")) {
            this.assetDescriptions = false
        }
        this.commodityID = null;

        /* For CM's */
        this.page = null;
        this.overview = null;
        this.listings = null;
        this.histogram = null;
    }

    /**
     * Updates the search node
     * @todo look at the output from the scm api ; maybe add the first listing to the cmitem and see how the parser should work
     * @param {*} callback 
     */
    updateSearchNode(callback) {
        const qs = {
            query: this.name,
            appid: this.appid,
            count: 1,
            ...params.qs
        }
        delete qs.currency;

        return searchMarket(qs)
            .then(search => {
                let node = null;

                for (let i = 0; i < search.length; i++) {
                    if (search[i].name === this.name) node = search[i];
                }

                if (!node || node.name !== this.name) {
                    return Promise.reject(new Error("Node was not found."));
                }
                
                this.updateSearchNodeFromObject(node);

                callback && callback(null, this);
                return this;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    /**
     * Updates the search node from an object
     * @param {CMSearchItem} node from other searches
     * @return {boolean} if update was successful
     */
    updateSearchNodeFromObject(node) {
        if (node.name !== this.name) {
            return false;
        }

        this.price = node.price;
        this.amount = node.amount;
        this.prefix = node.prefix;
        this.suffix = node.suffix;
        this.classid = node.classid;
        this.instanceid = node.instanceid;
        this.sale = node.sale;

        if (node.descriptions) this.descriptions = node.descriptions;
        if (node.marketTradableRestriction) this.marketTradableRestriction = node.marketTradableRestriction;
        if (node.marketMarketableRestriction) this.marketMarketableRestriction = node.marketMarketableRestriction;
        if (node.marketable) this.marketable = node.marketable;
        if (node.marketBuyCountryRestriction) this.marketBuyCountryRestriction = node.marketBuyCountryRestriction;
        /* To update commodity status */
        if (!this.commodity && node.commodity && this.assetDescriptions) this.commodity = node.commodity;
        /* The data for these properties is now old */
        if (!this.assetDescriptions) {
            this.old = true;
        }

        return true;
    }

    /**
     * Gets overview for the node
     * @param {Object} qs getOverview qs
     * @param {function(err, CMOverview)} callback 
     * @return {Promise<CMOverview>}
     */
    getOverview(qs, callback) {
        if (typeof qs === "function") {
            callback = qs;
            qs = null;
        }
        qs = qs || {}
        qs.currency = qs.currency || this.params.currency

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

    /**
     * Gets the page this search block belongs to
     * @param {Object} param getPage params
     * @param {function(err, CMPage)} [callback] 
     * @return {Promise<CMPage>}
     */
    getPage(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }
        params = params || {}
        params.currency = params.currency || this.params.currency;

        return getMarketItemPage(this.appid, this.hashName, params)
            .then(page => {
                this.page = page;
                
                this.listings = page.listings;
                this.histogram = page.histogram;
                this.commodityID = page.commodityID;

                callback && callback(null, page);
                return page;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    /**
     * Gets listings for the search node and updates the node
     * @param {Object} params getListings params
     * @param {function(err, listings)} [callback] 
     * @return {Promise<[CMListing]>}
     */
    getListings(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }
        params = params || {}
        params.currency = params.currency || this.params.currency;

        return getMarketItemListings(this.appid, this.hashName, params)
            .then(listings => {
                this.listings = listings;

                const firstListing = listings[0];
                /* Asset properties */
                this.type = firstListing.type;
                this.descriptions = firstListing.descriptions

                this.price = firstListing.price
                this.amount = !firstListing.commodity ? firstListing.length : this.amount;
                this.amountUpdated = !firstListing.commodity ? true : false;
                /* Market properties */
                this.tradable = firstListing.tradable;
                this.marketable = firstListing.marketable;
                this.marketTradableRestriction = firstListing.marketTradableRestriction;
                this.marketMarketableRestriction = firstListing.marketMarketableRestriction;
                this.marketBuyCountryRestriction = firstListing.marketBuyCountryRestriction;

                callback && callback(null, listings);
                return listings;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    /**
     * Gets histogram for the search node and updates the node
     * @param {Object} params getHistogram params
     * @param {function (err, histogram)} [callback]
     * @return {Promise<CMHistogram>}
     */
    getHistogram(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }
        params = params || {}
        params.currency = params.currency || this.params.currency;

        if (!this.commodityID) {
            return Promise.reject(new Error("No commodityID found."));
        }

        return getMarketItemHistogram(this.page.commodityID, params)
            .then(histogram => {
                this.histogram = histogram;

                /* Amount */
                let amount = 0;
                for(let i = 0; i < histogram.sellOrders; i++) {
                    const sellOrder = histogram.sellOrders[i];
                    amount += sellOrder[1];
                }
                this.amount = amount;
                this.amountUpdated = true;

                this.price = histogram.sellOrders[0] ? histogram.sellOrders[0][0] : 0;
                this.old = true;

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

const request = require("../request");
const { getMarketItemPage } = require("./CMItem");
const { getMarketItemOverview } = require("./CMOverview");
const { getMarketItemListings, CMListing } = require("./CMListing");
const { getMarketItemHistogram } = require("./CMHistogram");
const { parseCurrencyText, convertCurrencySign, convertCurrencyCode } = require("../helpers");
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");

/**
 * Searches the community market
 * @param {Object} [params]                             Option QS parameters
 * @param {String} [params.query]                       SCM query
 * @param {Number} [params.appid]
 * @param {Boolean} [params.searchDescriptions=false]   For Query
 * @param {Number} [params.start=0]                     From which block do we start
 * @param {Number} [params.count]                       How many search blocks we receive
 * @param {String} [params.sortColumn='price']          Slows response if not default value, can be'quantity', 'price', 'name' which column the search sorts by, Use when Query or Appid are set
 * @param {String} [params.sortDir='asc']               'acs', 'desc' directory of sorting, , Use when Query or Appid are set
 * @param {function(Error, CMSearchItem[])} [callback] 
 * @return {Promise<CMSearchItem[]>}
 */
function searchMarket(params, /* TODO: options, excludeExceptionAndCallbackResults */ callback) {
    if (typeof params === "function") {
        callback = params;
        params = null;
    }

    /* Query string parameters */
    params = { ...params } || {}    // Clones the Object
    params.query = params.query || '';
    params.appid = params.appid;
    params.search_descriptions = params.searchDescriptions || params.search_descriptions ? 1 : 0;
    params.start = params.start || 0;
    params.sort_column = params.sortColumn || params.sort_column || 'price';  // We really want to default sort by price
    params.sort_dir = params.sortDir || params.sort_dir || 'asc';             // Ascending
    params.norender = 1                                                           // Only norender to html
    
    /* Deletes params that arent used */
    delete params.searchDescriptions;
    delete params.sortColumn;
    delete params.sortDir;

    /* Sets fetchMore variable */
    let fetchMore;
    if (params.count > 100) fetchMore = parseInt(params.count);
    else if (params.count == undefined) fetchMore = true;
    else fetchMore = false;
    params.count = fetchMore ? 100 : params.count;

    /* We're giving right format to the custom appid params */
    if (params.appid) {
        for (let param in params) {
            // Just excluding already known properties
            if (["query", "appid", "search_descriptions", "start", "count", "sort_column", "sort_dir", "norender"].includes(param)) continue;
            // Steam stores other search attributes this way 
            params[`category_${params.appid}_${param}[]`] = `tag_${params[param]}`;
            // Deletes the original param from the cloned params
            delete params[param];
        }
    }

    return new Promise((resolve, reject) => {
        searchMarketCallback(params, fetchMore, (err, search) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }

            callback && callback(null, search);
            resolve(search);
        });
    })
}

/**
 * Callback version of searchMarket
 * @private
 * @see searchMarket
 */
function searchMarketCallback(params, fetchMore, callback, searchResults) {
    if (!searchResults && typeof fetchMore === "number") {
        fetchMore += params.start;
    }

    request("GET", "search/render", { json: true, gzip: true, qs: params }, (err, search) => {
        if (err) {
            callback(err);
            return;
        }
        
        let { results, total_count, pagesize } = search;
        
        /* Checks if there were any results to begin with */
        if (total_count < 1) {
            callback(new Error("No results found."));
            return;
        }

        /* Using CMSearchItem object */
        searchResults = searchResults || [];
        for (let i = 0; i < results.length; i++) {
            searchResults.push( new CMSearchItem(results[i]) );
        }

        /* Checks how many more do we need to search for */
        const celling = typeof fetchMore === "number" && fetchMore < total_count ? fetchMore : total_count;
        pagesize = parseInt(pagesize);
        if (params.start + pagesize < celling) {

            params.start += pagesize;                               // Current amount
            const toSearchFor = celling - params.start;             // How many are we missing
            params.count = toSearchFor < 100 ? toSearchFor : 100;   // How many are we searching for
            
            /* Watch for callstackExceededError */
            searchMarketCallback(params, fetchMore, callback, searchResults);
            return;
        } 

        callback(null, searchResults);
    })
}

/**
 * Classifies search data
 * @class CMSearchItem
 */
class CMSearchItem {
    
    /**
     * Classifies search data
     * @constructor
     * @param {Object} searchItem       JSON response from the API
     */
    constructor(searchItem) {
        /* Saves query strings for update */
        this.commodityID = null;

        /* Names, they both should be fairly the same */
        this.name = searchItem.name;
        this.marketHashName = searchItem.hash_name;
        
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
        
        /* Last sale info, does not include FEES */
        const salePriceMatch = parseCurrencyText(searchItem.sale_price_text);
        if (salePriceMatch.price) {
            this.sale = salePriceMatch.price;
        }

        /* If the results have all the necessery descriptions */
        this.descriptiveResults = true
        this.isOld = false;

        /* All the steamcommunity item properties */
        this.tradable = assets.tradable;
        this.marketable = assets.marketable;
        this.descriptions = assets.descriptions;                                            // Item descriptions
        this.commodity = assets.commodity === 1 ? true : false;
        this.marketTradableRestriction = assets.market_tradable_restriction;
        this.marketMarketableRestriction = assets.market_marketable_restriction;
        this.marketBuyCountryRestriction = assets.market_buy_country_restriction || null;   // Country restriction
        
        if (!assets.hasOwnProperty("descriptions") || !assets.hasOwnProperty("commodity") || !assets.hasOwnProperty("market_tradable_restriction") || !assets.hasOwnProperty("market_marketable_restriction") || !assets.hasOwnProperty("marketable") || !assets.hasOwnProperty("market_buy_country_restriction")) {
            this.descriptiveResults = false
        }

        /* For CM's */
        this.page = null;
        this.overview = null;
        this.listings = null;
        this.histogram = null;

        /* Default params for the CM's */
        this.params = {
            language: "english",
            country : "us",
            currency: this.currency
        }
    }

    /**
     * Updates the search node
     * @param {Number} [broadSearchCount]                 How many items should we search for to find the node
     * @param {function(Error, CMSearchItem)} [callback]
     * @return {Promise<CMSearchItem>}
     */
    updateSearchNode(broadSearchCount, callback) {
        if (typeof broadSearchCount === "function") {
            callback = broadSearchCount;
            broadSearchCount = false;
        }

        const qs = {
            query: broadSearchCount ? undefined : this.name,
            appid: this.appid,
            count: broadSearchCount ? undefined : 100,
        }

        return searchMarket(qs)
            .then(search => {
                /* Searches for the node in the search results */
                let node = null;
                for (let i = 0; i < search.length; i++) {
                    if (search[i].name === this.name) node = search[i];
                }

                /* If node was not found in the search */
                if (!node || node.name !== this.name) {
                    return Promise.reject(new Error("Node was not found."));
                }
                
                const updated = this.updateSearchNodeFromObject(node);
                if (!updated) {
                    return Promise.reject(new Error("Node was not updated."));
                }

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
     * @param {CMSearchItem} node   From other searches
     * @return {boolean}            If update was successful
     */
    updateSearchNodeFromObject(node) {
        if (node.name !== this.name) {
            return false;
        }

        /* These values are always suplied */
        this.price = node.price;
        this.amount = node.amount;
        this.prefix = node.prefix;
        this.suffix = node.suffix;
        this.classid = node.classid;
        this.instanceid = node.instanceid;
        this.sale = node.sale;

        /* These values are not always suplied */
        if (node.descriptions) this.descriptions = node.descriptions;
        if (node.marketTradableRestriction) this.marketTradableRestriction = node.marketTradableRestriction;
        if (node.marketMarketableRestriction) this.marketMarketableRestriction = node.marketMarketableRestriction;
        if (node.marketable) this.marketable = node.marketable;
        if (node.marketBuyCountryRestriction) this.marketBuyCountryRestriction = node.marketBuyCountryRestriction;
        
        /* To update commodity status */
        if (!this.commodity && node.commodity && this.descriptiveResults) this.commodity = node.commodity;

        /* Data is now old because not all properties were suplied */
        if (!this.descriptiveResults) {
            this.isOld = true;
        }

        return true;
    }

    /**
     * Gets overview for the node
     * @see getMarketItemOverview
     */
    getOverview(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        const oParams = params || {};
        params = { ...params } || {}
        params.currency = params.currency || this.params.currency   // Defaults to the this.params property

        const setOverview = !this.overview
        return (this.overview ? this.overview.update() : getMarketItemOverview(this.appid, this.marketHashName, params))
            .then(overview => {
                if (setOverview) this.overview = overview;
                
                this.price = overview.lowestPrice
                this.sale = overview.medianPrice;

                /* Changes the currency */
                if (oParams.currency) {
                    this._changeCurrency(oParams.currency);
                }

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
     * @see getMarketItemPage
     */
    getPage(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        /* Default parameters for updates */
        const oParams = params || {};
        params = { ...params } || {}
        params.currency = params.currency || this.params.currency;
        params.language = params.language || this.params.language;
        params.country = params.country || this.params.country;

        const setPage = !this.page;
        return (this.page ? this.page.update(params) : getMarketItemPage(this.appid, this.marketHashName, params))
            .then(page => {
                if (setPage) {
                    this.page = page;
                }

                this.commodityID = page.commodityID;

                /* Updates the histogram */
                if (this.histogram && page.histogram) this.histogram.updateFromObject(this.histogram);
                else this.histogram = page.histogram;
                
                /* Updates listings */
                this.listings = page.listings;
                if (page.listings && page.listings.length > 0) this._updateFirstListing(page.listings);

                if (oParams.currency) this.params.currency = oParams.currency;
                if (oParams.language) this.params.language = oParams.language;
                if (oParams.currency) this._changeCurrency(oParams.currency);

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
     * @see getMarketItemListings
     */
    getListings(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        /* Default parameters for getMarketItemListings */
        const oParams = params || {}
        params = { ...params } || {}
        params.currency = params.currency || this.params.currency;
        params.language = params.language || this.params.language;
        params.country = params.country || this.params.country;

        return getMarketItemListings(this.appid, this.marketHashName, params)
            .then(listings => {
                this.listings = listings;

                /* Gets the data for the first listing data */
                this._updateFirstListing(listings);
                
                /* Updates this.page */
                if (this.page) this.page.listings = listings;
                
                if (oParams.currency) this.params.currency = oParams.currency;
                if (oParams.language) this.params.language = oParams.language;
                if (oParams.currency) this._changeCurrency(oParams.currency);

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
     * @see getMarketItemHistogram
     */
    getHistogram(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        /* Default parameters for getMarketItemHistogram */
        const oParams = params || {}
        params = { ...params } || {}
        params.currency = params.currency || this.params.currency;
        params.language = params.language || this.params.language;
        params.country = params.country || this.params.country;

        /* */
        if (!this.commodityID) {
            return Promise.reject(new Error("No commodityID found."));
        }

        const setHistogram = !this.histogram;
        return (this.histogram ? this.histogram.update(params) : getMarketItemHistogram(this.commodityID, params))
            .then(histogram => {
                if (setHistogram) this.histogram = histogram;

                /* Amount */
                let amount = 0;
                for(let i = 0; i < histogram.sellOrders; i++) {
                    const sellOrder = histogram.sellOrders[i];
                    amount += sellOrder[1];
                }
                this.amount = amount;
                this.amountUpdated = true;

                /* Gets the lowest price */
                this.price = histogram.sellOrders[0] ? histogram.sellOrders[0][0] : 0;
                this.oldResults = true;

                /* Updates this.page */
                if (this.page) {
                    if (!this.page.histogram) {
                        this.page.histogram = histogram;
                        this.page.sellOrders = histogram.sellOrders;
                        this.page.buyOrders = histogram.buyOrders;
                    } else {
                        this.page.histogram.updateFromObject(histogram);
                    }
                }

                if (oParams.currency) this.params.currency = oParams.currency;
                if (oParams.language) this.params.language = oParams.language;
                if (oParams.currency) this._changeCurrency(oParams.currency);

                callback && callback(null, histogram);
                return histogram;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    /**
     * Updates the data
     * @private
     * @param {CMListing[]} listings 
     */
    _updateFirstListing(listings) {
        const firstListing = listings[0];
 
        /* Asset properties */
        this.type = firstListing.type;
        this.descriptions = firstListing.descriptions
        
        /* Price & Amount properties */
        this.price = firstListing.price
        this.amount = !firstListing.commodity ? firstListing.length : this.amount;
        this.amountUpdated = !firstListing.commodity ? true : false;
        
        /* Market properties */
        this.tradable = firstListing.tradable;
        this.marketable = firstListing.marketable;
        this.marketTradableRestriction = firstListing.marketTradableRestriction;
        this.marketMarketableRestriction = firstListing.marketMarketableRestriction;
        this.marketBuyCountryRestriction = firstListing.marketBuyCountryRestriction;
    } 

    /**
     * Changes the currency
     * @private
     * @param {ECMCurrencyCodes} currencyCode 
     */
    _changeCurrency(currencyCode) {
        this.params.currency = currencyCode;
        this.currency = currencyCode;

        const currency = convertCurrencyCode(this.params.currency);
        this.prefix = currency.prefix;
        this.suffix = currency.suffix;
    }
}

/**
 * @package
 */
module.exports = {
    CMSearchItem        : CMSearchItem,
    searchMarket        : searchMarket
};

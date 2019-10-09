const request = require("../request");
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");

/**
 * Gets histogram listings, they contain less info and require item_nameid property to be searched
 * @param {Number} itemNameID                       Special id property you can only get from scraping the main item page
 * @param {Object} [params]               
 * @param {Number} [params.two_factor=0]            Defaults to 0, unknown
 * @param {ECMCurrencyCodes} [params.currency=USD]  CMEMarketCurrencies code
 * @param {String} [params.language="english"]      Language name
 * @param {String} [params.country="us"]            Country code
 * @param {function (Error, CMHistogram)} [callback] 
 * @return {Promise<CMHistogram>}       
 */
const getMarketItemHistogram = function(itemNameID, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = null;
    }

    return new Promise((resolve, reject) => {
        /* Validates the itemNameID variable */
        if (!itemNameID && itemNameID != 0) {
            const noItemNameIDError = new Error("No itemNameID set.");
            callback && callback(noItemNameIDError);
            reject(noItemNameIDError);
            return;
        }

        /* Default values */
        params = { ...params } || {}
        params.item_nameid = itemNameID;
        params.two_factor = params.two_factor || 0;
        params.currency = params.currency || ECMCurrencyCodes.USD;
        params.language = params.language || "english";
        params.country = params.country || "us";

        request("GET", "itemordershistogram",  { json: true, gzip: true, qs: params }, (err, response) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }
    
            const histogramItem = new CMHistogram(itemNameID, params, response)
            callback && callback(null, histogramItem);
            resolve( histogramItem );
        })
    })
}

/**
 * Classifieds data from getMarketItemHistogram
 * @class CMHistogram
 */
class CMHistogram {
    
    /**
     * @constructor
     * @param {String} itemNameID   From getMarketItemHistogram
     * @param {Object} qs           From getMarketItemHistogram
     * @param {Object} data         From the API
     */
    constructor(itemNameID, params, data) {
        /* buyOrders & sellOrders [price, amount][]*/
        this.buyOrders = []
        for (let i = 0; i < data.buy_order_graph.length; i++) {
            const buyOrder = data.buy_order_graph[i];
            this.buyOrders.push([buyOrder[0], buyOrder[1]]);
        }

        this.sellOrders = [];
        for (let y = 0; y < data.sell_order_graph.length; y++) {
            const sellOrder = data.sell_order_graph[y];
            this.sellOrders.push([sellOrder[0], sellOrder[1]]);
        }

        this.prefix = data.price_prefix;
        this.suffix = data.price_suffix;

        /* For update method */
        this.itemNameID = itemNameID;
        this.params = params;

        delete params.item_nameid;
    }

    /**
     * Updates the histogram
     * @param {Object} [params]                                 Same as getMarketItemHistogram
     * @param {function(Error, CMHistogramResults)} [callback]
     * @return {Promise<CMHistogramResults>}  
     */
    update(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        return getMarketItemHistogram(this.itemNameID, params || this.params)
            .then(histogram => {
                this.updateFromObject(histogram);

                callback && callback(null, this);
                return this;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }

    /**
     * Rewrites the old data
     * @param {CMHistogram} histogram
     */
    updateFromObject(histogram) {
        this.sellOrders = histogram.sellOrders;
        this.buyOrders = histogram.buyOrders;
        this.prefix = histogram.prefix;
        this.suffix = histogram.suffix;
        this.params = histogram.params; // Only if user chooses to change the language, currency, country codes
    }

    /**
     * Gets the lowest buy order from buyOrders
     */
    getLowestBuyOrder() {
        const price = Math.max(...this.buyOrders.map(buyOrder => buyOrder[0]));
        const amount = ( this.buyOrders.some(buyOrder => buyOrder[0] == price) || [] )[1];
        return { price: price === -Infinity ? 0 : price, amount: amount || 0 }
    }

    /**
     * Gets the highest sell order from sellOrders
     */
    getHighestSellOrder() {
        const price = Math.min(...this.sellOrders.map(sellOrder => sellOrder[0]));
        const amount = ( this.sellOrders.some(sellOrder => sellOrder[0] == price) );
        return { price: price === Infinity ? 0 : price, amount: amount || 0 }
    }
}

/**
 * @package
 */
module.exports = {
    CMHistogram             : CMHistogram,
    getMarketItemHistogram  : getMarketItemHistogram
}
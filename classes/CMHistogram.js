const request = require("../request");
const Promises = require("@doctormckay/stdlib").Promises;
const CMEMarketCurrencies = require("../resources/CMEMarketCurrencies");

/**
 * Gets histogram listings, they contain less info and require item_nameid property to be searched
 * @param {Number} params.item_nameid   Special id property
 * @param {Number} params.two_factor    Defaults to 0, unknown
 * @param {Number} params.currency      CMEMarketCurrencies code
 * @param {String} params.language      Language code
 * @param {String} params.country       Country code
 * @param {function (err, CMHistogram)} callback 
 * @return {Promise<[CMHistogram]>}
 */
const getMarketItemHistogram = function(params, callback) {
    return Promises.callbackPromise([], callback, false, (accept, reject) => {
        if (!params.hasOwnProperty("itemNameID")) {
            reject(new Error("Set `itemNameID` property to it's id."));
            return;
        }

        const qs = {
            item_nameid : params.itemNameID,
            two_factor  : params.twoFactor || 0,
            currency    : params.currency || CMEMarketCurrencies.USD,
            language    : params.language || "en",
            country     : params.country || "us"
        }
        /* Incase you find some other query strings */
        for (const param in params) {
            if (params.hasOwnProperty(param)) continue;
            if (["itemNameID", "twoFactor", "currency", "language", "country"].includes(param)) continue;
            qs[param] = params[param];
        }

        request("GET", "itemordershistogram",  { json: true, gzip: true, qs: qs }, (err, response) => {
            if (err) {
                reject(err);
                return;
            }

            accept( new CMHistogram(response) );
        })
    })
}

/**
 * Classifieds data from getMarketItemHistogram
 * @class CMHistogram
 */
class CMHistogram {
    constructor(data) {
        /* TODO: will see if I want to keep these as Arrays or Objects */
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
    }

    /**
     * Gets the lowest buy order from buyOrders
     */
    getLowestBuyOrder() {
        const price = Math.min(...this.buyOrders.map(buyOrder => buyOrder[0]));
        const amount = ( this.buyOrders.some(buyOrder => buyOrder[0] == price) || [] )[1];
        return { price: price === Infinity ? 0 : price, amount: amount || 0 }
    }

    /**
     * Gets the highest sell order from sellOrders
     */
    getHighestSellOrders() {
        const price = Math.max(...this.sellOrders.map(sellOrder => sellOrder[0]));
        const amount = ( this.sellOrders.some(sellOrder => sellOrder[0] == price) );
        return { price: price === -Infinity ? 0 : price, amount: amount || 0 }
    }
}

/**
 * Contructs price with prefix & suffix
 * @param {Number} price 
 * @return {String} price with prefix and/or suffix 
 */
function getPriceToString(price) {
    if (this.prefix) price = this.prefix + price;
    if (this.suffix) price += this.suffix;
    return price;
}

module.exports = {
    CMHistogram             : CMHistogram,
    getMarketItemHistogram  : getMarketItemHistogram,
    getPriceToString        : getPriceToString
}
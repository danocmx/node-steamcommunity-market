const request = require("../request");
const Promises = require("@doctormckay/stdlib").Promises;
const CMEMarketCurrencies = require("../resources/CMEMarketCurrencies");
const { parseCurrencyText } = require("./CMSearchItem");

/**
 * Gets the market overview
 * @param {Number} appid        Steam AppID
 * @param {String} hashName     Market Hash Name
 * @param {Number} qs.currency  CMEMarketCurrencies code
 * @param {function(err, CMOverview)} [callback]
 * @return {Promise<CMOverview>}
 */
const getMarketItemOverview = function(appid, hashName, qs, callback) {
    return Promises.callbackPromise([], callback, false, (accept, reject) => {
        if (typeof qs === "function") {
            callback = qs;
            qs = null;
        }
        
        qs = qs || {}
        qs.appid = appid;
        qs["market_hash_name"] = hashName;
        qs.currency = qs.currency || CMEMarketCurrencies.USD;

        request("GET", "priceoverview", { json: true, gzip: true, qs: qs }, (err, body) => {
            if (err) {
                reject(err);
                return;
            }

            const newQS = {}
            for (const param in qs) {
                if (!qs.hasOwnProperty(param)) continue;
                if (["appid", "market_hash_name"].includes(param)) continue;
                newQS[param] = qs[param];
            }

            accept( new CMOverview(appid, hashName, newQS, body) );          
        })
    })
}

/**
 * Classifieds response data
 * @class CMOverview
 */
class CMOverview {
    /**
     * Classifieds response data
     * @param {Object} marketOverviewResults what we receive from steam
     */
    constructor(appid, item, qs, marketOverviewResults) {
        this.appid = appid;
        this.item = item;
        this.qs = qs;

        this.lowestPrice = parseCurrencyText(marketOverviewResults["lowest_price"]).price;
        this.medianPrice = parseCurrencyText(marketOverviewResults["median_price"]).price || 0; 
        this.volume = marketOverviewResults["volume"] || 0;
    }

    /**
     * Updates the overview
     * @param {function(err, CMOverview)} [callback]
     * @return {Promise.<Result>}  
     */
    update(callback) {
        return Promises.callbackPromise([], true, callback, (accept, reject) => {
            getMarketItemOverview(this.appid, this.item, this.qs, (err, overview) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.lowestPrice = overview.lowestPrice;
                this.medianPrice = overview.medianPrice;
                this.volume = overview.volume;

                accept(overview);
            })
        })
    }
}

module.exports = {
    CMOverview              : CMOverview,
    getMarketItemOverview   : getMarketItemOverview
};

const request = require("../request");
const Promises = require("@doctormckay/stdlib").Promises;

/**
 * Gets the market overview
 * @param {Number} appid        Steam AppID
 * @param {String} hashName     Market Hash Name
 * @param {Number} qs.currency  CMEMarketCurrencies code
 * @param {function(err, CMOverview)} callback
 * @return {Promise<CMOverview>}
 */
const getMarketItemOverview = function(appid, hashName, qs = {}, callback) {
    return Promises.callbackPromise([], callback, false, (accept, reject) => {
        qs.appid = appid;
        qs.hashName = hashName;

        if (!("currency") in qs) {
            qs.currency = this.options.currency;
        }

        request("GET", "priceoverview", { json: true, gzip: true, qs: qs }, (err, body) => {
            if (err) {
                reject(err);
                return;
            }

            accept( CMOverview(body) );          
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
    constructor(marketOverviewResults) {
        this.lowestPrice = marketOverviewResults["lowest_price"];
        this.medianPrice = marketOverviewResults["median_price"] || this.lowestPrice; 
        this.volume = marketOverviewResults["volume"] || 0;
    }
}

module.exports = {
    CMOverview              : CMOverview,
    getMarketItemOverview   : getMarketItemOverview
};

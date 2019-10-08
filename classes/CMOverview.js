const request = require("../request");
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");
const { parseCurrencyText } = require("../helpers");

/**
 * Gets the market overview
 * @param {Number} appid        Steam AppID
 * @param {String} hashName     Market Hash Name
 * @param {Number} qs.currency  ECMCurrencyCodes code
 * @param {function(err, CMOverview)} [callback]
 * @return {Promise<CMOverview>}
 */
const getMarketItemOverview = function(appid, hashName, qs, callback) {
    if (typeof qs === "function") {
        callback = qs;
        qs = null;
    }
    
    return new Promise((resolve, reject) => {
        qs = qs || {}
        qs.appid = appid;
        qs["market_hash_name"] = hashName;
        qs.currency = qs.currency || ECMCurrencyCodes.USD;
        
        request("GET", "priceoverview", { json: true, gzip: true, qs: qs }, (err, body) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }

            const newQS = {}
            for (const param in qs) {
                if (!qs.hasOwnProperty(param)) continue;
                if (["appid", "market_hash_name"].includes(param)) continue;
                newQS[param] = qs[param];
            }

            const overview = new CMOverview(appid, hashName, newQS, body);
            callback && callback(null, overview);
            resolve( overview );          
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
        this.medianPrice = parseCurrencyText(marketOverviewResults["median_price"]).price;
        this.volume = marketOverviewResults["volume"] || 0;
    }

    /**
     * Updates the overview
     * @param {function(err, CMOverview)} [callback]
     * @return {Promise.<Result>}  
     */
    update(callback) {
        return getMarketItemOverview(this.appid, this.item, this.qs)
            .then(overview => {
                this.lowestPrice = parseCurrencyText(overview.lowestPrice).price;
                this.medianPrice = parseCurrencyText(overview["median_price"]).price;
                this.volume = overview.volume;

                callback && callback(null, this);
                return this;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }
}

module.exports = {
    CMOverview              : CMOverview,
    getMarketItemOverview   : getMarketItemOverview
};

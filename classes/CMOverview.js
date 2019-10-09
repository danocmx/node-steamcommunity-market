const request = require("../request");
const { ECMCurrencyCodes } = require("../resources/ECMCurrencies");
const { parseCurrencyText } = require("../helpers");

/**
 * Gets the market overview
 * @param {Number} appid                            Steam AppID
 * @param {String} marketHashName                   
 * @param {Object} [params]                         Optional query string parameters to the object, 
 * @param {ECMCurrencyCodes} [params.currency=USD]  ECMCurrencyCodes code
 * @param {function(Error, CMOverview)} [callback]
 * @return {Promise<CMOverview>}
 */
const getMarketItemOverview = function(appid, marketHashName, params, callback) {
    if (typeof params === "function") {
        callback = params;
        params = null;
    }
    
    return new Promise((resolve, reject) => {
        params = { ...params } || {}
        params.appid = appid;
        params["market_hash_name"] = marketHashName;
        params.currency = params.currency || ECMCurrencyCodes.USD;
        
        request("GET", "priceoverview", { json: true, gzip: true, qs: params }, (err, body) => {
            if (err) {
                callback && callback(err);
                reject(err);
                return;
            }

            const Overview = new CMOverview(appid, marketHashName, params, body);
            callback && callback(null, Overview);
            resolve( Overview );          
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
     * @constructor
     * @param {Number} appid
     * @param {String} marketHashName                      
     * @param {Object} qs                       from getMarketItemOverview
     * @param {Object} marketOverviewResults    from API
     */
    constructor(appid, marketHashName, qs, marketOverviewResults) {
        this.appid = appid;
        this.marketHashName = marketHashName;
        
        this.lowestPrice = parseCurrencyText(marketOverviewResults["lowest_price"]).price;
        this.medianPrice = parseCurrencyText(marketOverviewResults["median_price"] || "").price
        this.volume = marketOverviewResults["volume"] || 0;

        this.qs = qs;
        delete qs.appid;
        delete qs.marketHashName;
    }

    /**
     * Updates the overview
     * @see getMarketItemOverview  
     */
    update(params, callback) {
        if (typeof params === "function") {
            callback = params;
            params = null;
        }

        return getMarketItemOverview(this.appid, this.marketHashName, params || this.qs)
            .then(overview => {
                this.lowestPrice = parseCurrencyText(overview.lowestPrice).price;
                this.medianPrice = parseCurrencyText(overview["median_price"]).price;
                this.volume = overview.volume;

                /* Incase the user changes qs */
                this.qs = overview.qs;

                callback && callback(null, this);
                return this;
            })
            .catch(err => {
                callback && callback(err);
                return err;
            })
    }
}

/**
 * @package
 */
module.exports = {
    CMOverview              : CMOverview,
    getMarketItemOverview   : getMarketItemOverview
};

const SCM = require("../index");
const Promises = require("@doctormckay/stdlib").Promises;
const request = require("../helpers/request");
const CEconListingItem = require("../classes/CEconListingItem");
const url = require("url");


SCM.prototype.getMarketItemListings = function(params, callback) {
    return Promises.callbackPromise(["listings"], callback, true, (accept, reject) => {
        if (!params.hasOwnProperty("appid") || !params.hasOwnProperty("item")) {
            reject(new Error("Required property not set."));
            return;
        }

        const appid = params.appid;
        const item = params.item;
        
        const qs = {
            start: params.start || 0,
            country: params.country || this.options.country,
            language: params.language || this.options.language,
            currency: params.currency || this.options.currency
        }

        request({
            method: "GET",
            url: url.parse(`https://steamcommunity.com/market/listings/${appid}/${item}/render/`).href,
            qs: qs,
            gzip: true,
            json: true
        }, (err, response) => {
            if (err) {
                reject(err);
                return;
            }

            accept({
                listings: sortListings(response, appid)
            });
        })
    })
}

function sortListings(listings, appid) {
    const sorted = []

    if (!listings.hasOwnProperty("success") && listings.success !== true) {
        return sorted;
    }
    
    for (let id in listings.listinginfo) {
        if (!listings.listinginfo.hasOwnProperty(id)) continue;
        const listing = listings.listinginfo[id];

        if (listing.asset.appid != appid) {
            continue;
        }

        const contextID = listing.asset.contextid;
        const assetID = listing.asset.id;
        if (!(appid in listings.assets) || !(contextID in listings.assets[appid]) || !(assetID in listings.assets[appid][contextID])) {
            continue;
        }

        const asset = listings.assets[appid][contextID][assetID];
        sorted.push( new CEconListingItem(asset, listing) );
    }

    return sorted;
}

module.exports = SCM;

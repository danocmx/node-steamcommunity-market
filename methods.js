const SCM = require("./index");
const Promises = require("@doctormckay/stdlib").Promises;
const CEconListingItem = require("./classes/CEconListingItem");


/* TODO: add live page info; */

SCM.prototype.getSearchRender = function(params, callback=null) {
    return Promises.callbackPromise(["items"], true, callback, (accept, reject) => {
        const modifedParams = this._modifySCMParams(params)

        this.community.marketSearch( modifedParams, (err, items) => {
            if (err) {
                reject(err);
                return;
            }
            accept({
                items: items
            })
        })
    })
}

SCM.prototype.getMarketItem = function(params, callback=null) {
    return Promises.callbackPromise(["item"], true, callback, (accept, reject) => {
        if (!params.hasOwnProperty("appid") || !params.hasOwnProperty("name")) {
            reject(new Error("Required property not set."));
            return;
        }

        this.community.getMarketItem(params.appid, params.name, (err, item) => {
            if (err) {
                reject(err);
                return;
            }
            
            accept({
                item: item
            })
        })
    })
}

SCM.prototype.getMarketItemListings = function(params, callback) {
    return Promises.callbackPromise(["listings"], callback, true, (accept, reject) => {
        if (!params.hasOwnProperty("appid") || !params.hasOwnProperty("item")) {
            reject(new Error("Required property not set."));
            return;
        }

        const appid = params.appid;
        const item = params.item;
        
        delete params.appid;
        delete params.item;

        this._request({
            method: "GET",
            url: `https://steamcommunity.com/market/listings/${appid}/${item}/render/`,
            qs: params,
            gzip: true,
            json: true
        }, (err, response) => {
            if (err) {
                reject(err);
                return;
            }
            const render = {
                listings: []
            }

            if (!response.hasOwnProperty("success") && response.success !== true) {
                accept(render);
                return;
            }

            for (let id in response.listinginfo) {
                if (!response.listinginfo.hasOwnProperty("id")) continue;
                const listing = response.listinginfo[id];

                if (listing.asset.appid !== appid) {
                    continue;
                }

                const contextID = listing.asset.contextid;
                const assetID = listing.asset.id;
                if (!(appid in response.assets) || !(contextID in response.assets[appid]) || !(assetID in response.assets[appid][contextID])) {
                    continue;
                }

                const asset = listing.assets[appid][contextID][assetID];
                
                render.listings.push(CEconListingItem(asset, listing));
            }

            accept(render);
        })
    })
}

SCM.prototype.getMarketItemOverview = function() {

}

SCM.prototype.getMarketItemHistogram = function() {
    
}

SCM.prototype.getRecent = function() {

}

SCM.prototype.getRecentlySold = function() {

}

SCM.prototype.getPopular = function() {
    
}

module.exports = SCM;

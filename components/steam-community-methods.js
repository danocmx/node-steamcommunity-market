const SCM = require("../index");
const Promises = require("@doctormckay/stdlib");


SCM.prototype.getSearchRender = function(params, callback=null) {
    return Promises.callbackPromise(["items"], true, callback, (accept, reject) => {
        const modifedParams = modifySCMParams(params)

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

function modifySCMParams(params) {
    const modifiedParams = {}
    for (const param in params) {
        if (!params.hasOwnProperty(param)) continue;
        
        let capitalizedParam = capitalizeFirstLetter(param);        
        let lowerCasedParam = params[param].toLowerCase();

        if (!(capitalizedParam in QUERY_STRINGS) || !(lowerCasedParam in QUERY_STRINGS[capitalizedParam])) {
            modifiedParams[param] = params[param];
            continue;
        }
        
        modifiedParams[ capitalizedParam ] = QUERY_STRINGS[ capitalizedParam ][ lowerCasedParam ];
    }
    return modifiedParams;
}

function capitalizeFirstLetter(word) {
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

module.exports = SCM;

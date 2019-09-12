const SCM = require("./index");
const request = require("request");

/* TODO: complete QUERY_STRINGS */
const QUERY_STRINGS = {
    "Quality": {
        "unusual": "rarity4"
    },
    "Type": {
        "Type": "misc"
    }
}

SCM.prototype._modifySCMParams = function(params) {
    const modifiedParams = {}
    for (const param in params) {
        if (!params.hasOwnProperty(param)) continue;
        
        let capitalizedParam = this._capitalizeFirstLetter(param);        
        let lowerCasedParam = params[param].toLowerCase();

        if (!(capitalizedParam in QUERY_STRINGS) || !(lowerCasedParam in QUERY_STRINGS[capitalizedParam])) {
            modifiedParams[param] = params[param];
            continue;
        }
        
        modifiedParams[ capitalizedParam ] = QUERY_STRINGS[ capitalizedParam ][ lowerCasedParam ];
    }
    return modifiedParams;
}

SCM.prototype._capitalizeFirstLetter = function(word) {
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

SCM.prototype._request = function(options, callback) {
    request(options, (err, response, body) => {
        if (err) {
            callback(err);
            return;
        }

        if (response.statusCode > 299 || response.statusCode < 199) {
            callback(new Error("Bad error code: " + response.statusCode));
            return;
        }

        if (!body) {
            callback(new Error("No body found."));
            return;
        }

        callback(null, body);
    })
}


module.exports = SCM;
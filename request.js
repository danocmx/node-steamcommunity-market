const request = require("request");

/**
 * Sends a request using request lib
 * @param {String} method                   HTTPS method
 * @param {String} endpoint                 Steamcommunity.com/market endpoint
 * @param {Object} params                   Request parameters
 * @param {function (err, body)} callback 
 */
function req(method, endpoint, params, callback) {
    /* TODO: add request limit management */

    const host = "https://steamcommunity.com/";
    const path = "market/";
    let uri = host + path;
    if (endpoint) uri += endpoint;

    const options = {
        method  : method,
        uri     : uri,
        headers : {
            referer   : uri.replace("/render", ""), // Render API's have different referers
            "User-Agent": "request"                 // Basic request lib user-agent
        },
        ...params                                   // Rewrites previous params if necessery
    }

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

        /* JSON APIs have success property indicating the successness */
        if (params.json === true && !(body.success == true || body.success == 1)) {
            callback(new Error("Request was unsuccessful."));
            return;
        }

        callback(null, body);
    })
}

/**
 * @package
 */
module.exports = req;
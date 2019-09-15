const request = require("request");


function req(options, callback) {
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

module.exports = req;
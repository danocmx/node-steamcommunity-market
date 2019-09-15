const events = require("events").EventEmitter
const inherits = require("util").inherits;
const SteamCommunity = require("steamcommunity");
const EMarketCurrencies = require("./resources/EMarketCurrencies");

/* TODO: add storage, setOption, proxies, options, compare-function; request only the scm page and get infos from all requests*/
inherits(SCM, events);
module.exports = SCM;


function SCM(options = {}) {
    this.options = {
        currency: options.currency || EMarketCurrencies.USD,
        language: options.language || "en",
        country: options.country || "us"
    };
    this.community = new SteamCommunity();
}

SCM.prototype.setOption = function() {

}

require("./components/market-listings");
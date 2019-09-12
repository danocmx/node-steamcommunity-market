const events = require("events").EventEmitter
const inherits = require("util").inherits;
const SteamCommunity = require("steamcommunity");

/* TODO: add storage, setOption, proxies, options, compare-function*/
inherits(SCM, events);
module.exports = SCM;


function SCM({ currency=1 }) {
    this.options = {
        currency: currency
    }
    this.community = new SteamCommunity();
}

SCM.prototype.setOption = function() {

}

require("./methods")
require("./helpers");

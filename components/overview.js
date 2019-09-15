const SCM = require("../index");
const request = require("../helpers/request");

SCM.prototype.getMarketItemOverview = function() {
    "https://steamcommunity.com/market/priceoverview/?appid={appid}&currency={currency}&market_hash_name={parse.quote(market_hash_name)}'"
}

module.exports = SCM;

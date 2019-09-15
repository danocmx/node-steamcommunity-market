const SCM = require("../index");
const request = require("../helpers/request");
const cheerio = require("cheerio");


SCM.prototype.getMarketItemHistogram = function() {
    "https://steamcommunity.com/market/itemordershistogram?country=CZ&language=english&currency=3&item_nameid=56741408&two_factor=0"
}

module.exports = SCM;
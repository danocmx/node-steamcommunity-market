"use strict";

/* Classes */
const CMHistogram = require("./classes/CMHistogram");
const CMItem = require("./classes/CMItem");
const CMListing = require("./classes/CMListing");
const CMOverview = require("./classes/CMOverview");
const CMSearchItem = require("./classes/CMSearchItem");

/* Enums */
const ECMCurrencies = require("./resources/ECMCurrencies");

/* Helpers */
const Helpers = require("./helpers");

/* TODO: 
- Centralize, make a SCM class controlling the requests 
- HTTP headers
- centralize all known errors by steam
- add embeding?
*/

/**
 * Includes all the methods, enums and classes
 * @package
 */
module.exports = {
    enums                   : {
        ECMCurrencies   : ECMCurrencies
    },
    /* Classes added so users can add their methods to prototype */
    classes                 : {
        CMHistogram     : CMHistogram.CMHistogram,
        CMItem          : CMItem.CMItem,
        CMListing       : CMListing.CMListing,
        CMOverview      : CMOverview.CMOverview,
        CMSearchItem    : CMSearchItem.CMSearchItem
    },
    utils                   : Helpers,
    /* Current public static methods to use the SCM API */
    getMarketItemHistogram  : CMHistogram.getMarketItemHistogram,
    getMarketItemPage       : CMItem.getMarketItemPage,
    getMarketItemListings   : CMListing.getMarketItemListings,
    getMarketItemOverview   : CMOverview.getMarketItemOverview,
    searchMarket            : CMSearchItem.searchMarket
}

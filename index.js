"use strict";

/* Classes */
const CMHistogram = require("./classes/CMHistogram");
const CMItem = require("./classes/CMItem");
const CMListing = require("./classes/CMListing");
const CMOverview = require("./classes/CMOverview");
const CMSearchItem = require("./classes/CMSearchItem");

/* Enums */
const ECMCurrencies = require("./resources/ECMCurrencies");

/* TODO: 
- Centralize, make a SCM class controlling the request limits
- HTTP headers
- JSDoc
*/

/**
 * Includes all the methods, enums and classes
 * @package
 */
module.exports = {
    enums                   : {
        ECMCurrencies: ECMCurrencies
    },
    classes                 : {
        CMHistogram : CMHistogram.CMHistogram,
        CMItem      : CMItem.CMItem,
        CMListing   : CMListing.CMListing,
        CMOverview  : CMOverview.CMOverview,
        CMSearchItem: CMSearchItem.CMSearchItem
    },
    utils                   : {
        sortListings    : CMListing.sortListings,
        getPriceToString: CMHistogram.getPriceToString
    },
    getMarketItemHistogram  : CMHistogram.getMarketItemHistogram,
    getMarketItemPage       : CMItem.getMarketItemPage,
    getMarketItemListings   : CMListing.getMarketItemListings,
    getMarketItemOverview   : CMOverview.getMarketItemOverview,
    searchMarket            : CMSearchItem.searchMarket
}

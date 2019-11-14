const SCM = require("./index");

// TODO: add a test framework...

SCM.searchMarket({
    count       : 100,
    sortColumn  : 'price',
    "Type"      : "misc",
    "Quality"   : "rarity4",
    appid       : 440
})
    .then(results => {
        log("Received: " + results.length + " search results.", "\x1b[46m" + "\x1b[37m")
        const searchNode = results[0];
        return searchNode.updateSearchNode()
    })
    .then(searchNode => {
        return Promise.all([ searchNode.getOverview(), searchNode.getListings({ currency: 2 }), searchNode.getPage() ])
    .then(async ([overview, listings, page]) => {
        // Object linking
        let listingsUpdatedFromPage;
        try {
            listingsUpdatedFromPage = await searchNode.page.getListings({ currency: 3 })
        } catch(e) {
            return Promise.reject(new Error("Error while updating listings: " + e.message));
        } 

        if (listings !== page.listings !== listingsUpdatedFromPage) {
            return Promise.reject(new Error("Listings are not linked."))
        }

        let histogram, updatedHistogram;
        try {
            histogram = await searchNode.page.getHistogram();
            updatedHistogram = await histogram.update();
        } catch(e) {
            return Promise.reject(new Error("Error while getting histogram: " + e.message));
        }

        if (histogram !== updatedHistogram) {
            return Promise.reject(new Error("Histograms are not linked."));
        }

        return SCM.getMarketItemPage(440, "Unusual Waxy Wayfinder");
    })
    .then(() => {
        log("Received histogram.", "\x1b[46m" + "\x1b[37m")
        return SCM.getMarketItemPage(440, "Unusual Waxy Wayfinder")
    })
    .then(page => {
        log("Received: item page", "\x1b[46m" + "\x1b[37m")
        return page.getHistogram()
    })
    .then(() => {
        log("TEST: SUCCESSFUL.", "\x1b[42m" + "\x1b[37m"); 
    })
    .catch(err => {
        log("TEST: UNSUCCESSFUL.", "\x1b[41m" + "\x1b[33m"); 
        log("ERROR: " + err, "\x1b[41m" + "\x1b[33m");
    })

function log(message, color) {
    console.log(color + message + "\x1b[0m")
}
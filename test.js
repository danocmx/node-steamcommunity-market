const SCM = require("./index");

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
        return Promise.all([ searchNode.getOverview(), searchNode.getListings(), searchNode.getPage() ])
            .then(([overview, listings, page]) => {
                // Object linking
                if (listings !== page.listings) {
                    return Promise.reject(new Error("Listings are not linked."))
                }

                log("Received overview, listings, page of a searchNode.", "\x1b[46m" + "\x1b[37m")

                return searchNode.page.getListings()
            })
            .then(listings => {
                // Object linking
                if (listings !== searchNode.page.listings) {
                    return Promise.reject(new Error("Listings are not linked."))
                }
                // Now we have itemNameID from page load
                return searchNode.page.getHistogram();
            })
            .then(histogram => {
                return histogram.update()
            })
            .then(histogram => {
                if (histogram !== searchNode.histogram) {
                    return Promise.reject(new Error("Histograms are not linked."));
                }
            })
    }).then(() => {
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
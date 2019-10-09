const SCM = require("./index");

SCM.searchMarket({
    count       : 150,
    sortColumn  : 'price',
    appid       : 440
})
    .then(results => {
        const searchNode = results[0];
        return searchNode.updateSearchNode()
    })
    .then(searchNode => {
        return Promise.all([ searchNode.getOverview(), searchNode.getListings(), searchNode.getPage() ])
            .then(() => {
                // Now we have itemNameID
                return searchNode.getHistogram();
            })
    }).then(() => {
        return SCM.getMarketItemPage(440, "Unusual Waxy Wayfinder")
    })
    .then(page => {
        return page.getHistogram()
    })
    .then(() => {
        console.log("\x1b[45m" + "\x1b[34m" + "TEST: SUCCESSFUL." + "\x1b[0m"); 
    })
    .catch(err => {
        console.log("\x1b[41m" + "\x1b[33m" + "TEST: UNSUCCESSFUL." + "\x1b[0m"); 
        console.log("\x1b[41m" + "\x1b[33m" + "ERROR", err + "\x1b[0m");
    })
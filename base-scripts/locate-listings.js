const SCM = new (require("../index"));
const async = require("async");

SCM.getSearchRender({
    appid: "440",
    quality: "Unusual",
    Type: "misc"
})
    .then(({ items }) => {
        async.eachLimit(items, 1, getListings, (err) => {

        })

        function getListings(item, cb) {
            console.log(++x)
        }
    })
    .catch(err => {
        console.log("Error: " + err.message);
    });
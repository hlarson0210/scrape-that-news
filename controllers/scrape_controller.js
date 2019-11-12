let db = require("../models");
let express = require("express");
let router = express.Router();
let cheerio = require("cheerio");
let axios = require("axios");

router.get("/", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
        .then(res.render("index"));
});

router.get("/scrape", function (req, res) {
    // Make request via axios to grab the HTML from `awwards's` clean website section
    axios.get("http://www.awwwards.com/websites/clean/").then(function (response) {

        // Load the HTML into cheerio
        let $ = cheerio.load(response.data);

        // Make an empty array for saving our scraped info
        let results = [];

        // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
        $("figure.rollover").each(function (i, element) {

            /* Cheerio's find method will "find" the first matching child element in a parent.
             *    We start at the current element, then "find" its first child a-tag.
             *    Then, we "find" the lone child img-tag in that a-tag.
             *    Then, .attr grabs the imgs srcset value.
             *    The srcset value is used instead of src in this case because of how they're displaying the images
             *    Visit the website and inspect the DOM if there's any confusion
            */
            let imgLink = $(element).find("a").find("img").attr("data-srcset").split(",")[0].split(" ")[0];

            // Push the image's URL (saved to the imgLink var) into the results array
            results.push({ link: imgLink });
        });

        // After looping through each element found, log the results to the console
        console.log(results);
        res.render("index");
    });
})

module.exports = router;
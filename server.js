let express = require("express");
let morgan = require("morgan");
let mongoose = require("mongoose");
let path = require("path");
let cheerio = require("cheerio");
let axios = require("axios");
let PORT = 3000;

let app = express();
// Use morgan logger for logging requests
app.use(morgan("dev"));
// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '/public')));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
let routes = require("./controllers/scrape_controller.js");
app.use(routes);

// First, tell the console what server3.js is doing
console.log("\n******************************************\n" +
    "Look at the image of every award winner in \n" +
    "one of the pages of `awwwards.com`. Then,\n" +
    "grab the image's source URL." +
    "\n******************************************\n");

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
});


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
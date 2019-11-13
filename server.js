let express = require("express");
let morgan = require("morgan");
let mongoose = require("mongoose");
let path = require("path");
let PORT = process.env.PORT || 3000;

let app = express();
// Use morgan logger for logging requests
app.use(morgan("dev"));
// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '/public')));

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


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


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
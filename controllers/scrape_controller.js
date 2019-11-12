let db = require("../models");
let express = require("express");
let router = express.Router();

router.get("/", function (req, res) {
    let chicken = console.log("HI");
    res.render("index", chicken);
});


module.exports = router;
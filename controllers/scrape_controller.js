let db = require("../models");
let express = require("express");
let router = express.Router();
let cheerio = require("cheerio");
let axios = require("axios");

router.get("/", function (req, res) {
    db.Article.find({})
        .then(data => {
            let newsObj = {
                Article: data
            }
            res.render("index", newsObj)
        }).catch(function (err) {
            res.json(err);
        });
});

router.get("/scrape", function (req, res) {
    axios.get("https://www.huffpost.com/").then(function (response) {
        let $ = cheerio.load(response.data);

        $(".card__text").each(function (i, element) {
            let scraped = {};

            scraped.title = $(element).find(".card__headline__text").text();
            scraped.summary = $(element).find(".card__description").text();
            scraped.link = $(element).find(".card__headline").attr("href");

            const query = {
                title: scraped.title
            };
            const options = {
                upsert: true,
                setDefaultsOnInsert: true
            };
            db.Article.update(query, scraped, options)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.render("index");
    });

});

router.get("/api/drop", function (req, res) {
    db.Article.remove({});
    res.render("index");
});

router.get("/articles", (req, res) => {
    db.Article.find({})
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
});

router.get("/saved-articles", function (req, res) {
    db.Article.find({ saved: true })
    res.render("note");
});

router.post("/saved-articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;
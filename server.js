
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
// scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//require models
var Article = require("./models/Article.js");

// initialize express
var app = express();

// use body parser
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static directory
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Database configuration with mongoose
// you will connect to the database here once it's created
mongoose.connect("mongodb://localhost/articles");
var db = mongoose.connection;

//show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// =======================================
// ROUTES
// =======================================

// GET request to scrape news site and then go to home
app.get("/", function (req, res) {

    // before scraping, delete all old articles that haven't been saved
    // prevents db from becoming needlessly large upon refresh
    Article.find({
        saved: false
    }).remove().exec();

    // grab body of html with request
    request("http://www.goodnewsnetwork.org/", function (error, response, html) {
        // load that into cheerio and save it into $C as selector
        var $C = cheerio.load(html);

        // empty result array OLD
        // var result = [];

        $C("h3.entry-title").each(function(i, element) {

            // empty result object
            var result = {};

            // save title/text and link of each article
            result.title = $C(this).children("a").text();
            result.link = $C(this).children("a").attr("href");
            
            // create new entry passing result into Article model
            var entry = new Article(result);

            // save entry to the db
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                }
            });

            // OLD WORKING -- pushing scraped info into array
            // var title = $C(element).children("a").text();
            // var link = $C(element).children("a").attr("href");

            // result.push({
            //     title: title,
            //     link: link
            // });
            // -----------------------------------------------
        });
        //console.log(result);
    });
    res.redirect("../home");
});

app.get("/home", function(req, res) {
    Article.find({}).then(function(Article) {
        res.render("index", { articles : Article }); 
    }).catch(function(error) {
        console.log(error)
    });
});



// listen on port 3000
app.listen(3000, function() {
    console.log("app listening on port 3000!");
});
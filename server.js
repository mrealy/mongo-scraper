
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// scraping tools
var request = require("request");
var cheerio = require("cheerio");
//require models

// initialize express
var app = express();

// use body parser
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static directory
app.use(express.static("public"));

// Database configuration with mongoose
// you will connect to the database here once it's created

// GET request to scrape news site
app.get("/scrape", function (req, res) {
    // grab body of html with request
    request("http://www.goodnewsnetwork.org/", function (error, response, html) {
        // load that into cheerio and save it into $C as selector
        var $C = cheerio.load(html);
        // Grab ever within an article tag
        $C("td_mod6 h3").each(function(i, element) {
            // empty result object
            var result = {};
            // save title/text and link of each article
            result.title = $C(this).children("a").text();
            result.link = $C(this).children("a").attr("href");

        
        });
        // result is undefined...
        console.log("result is ", result);
    });
    res.send("Scrape done");
});



// listen on port 3000
app.listen(3000, function() {
    console.log("app listening on port 3000!");
});
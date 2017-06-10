
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var path = require("path");
// scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//require models
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");   
// initialize express
var app = express();

// use body parser
app.use(bodyParser.urlencoded({
    extended: false
}));

//method override
app.use(methodOverride("_method"));

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

        $C("h3.entry-title").each(function(i, element) {

            // empty result object
            var result = {};

            // save title/text and link of each article
            result.title = $C(this).children("a").text();
            result.link = $C(this).children("a").attr("href");
            dbEntry(result); 
        }); //close cheerios
        function dbEntry(result) {
            // create new entry passing result into Article model
            var entry = new Article(result);

            // save entry to the db
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    //console.log(doc);
                }
            }); // closes entry   
        }
        console.log("finished scrape");
        res.redirect("../home");
    }); // close request
    // res.redirect("../home"); 
});

app.get("/home", function(req, res) {
    Article.find({}).then(function(Article) {
        res.render("index", { articles : Article }); 
    }).catch(function(error) {
        console.log(error)
    });
});

app.put("/:id", function(req, res) {
    var id = req.params.id;
    console.log(id);
    Article.update(
        { "_id" : id }, { $set: { "saved" : true }}
    ).then(function(dbArticles) {
        res.redirect("../");
    });
});

app.get("/saved", function(req, res) {
    Article.find(
        { "saved" : true }
    ).then(function(dbSaved) {
        res.render("saved", { articles: dbSaved });
    }).catch(function(error) {
        console.log(error);
    });
});

app.delete("/remove/:id", function(req, res) {
    var id = req.params.id;
    Article.remove(
        { "_id" : id}
    ).then(function(dbArticles) {
        res.redirect("/saved");
    });
});

app.get("/comments/:id", function(req, res) {
    Article.findOne({ "_id" : req.params.id })
    .populate("comment")
    .exec(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});

app.post("/comments/:id", function(req, res) {
    var newComment = new Comment(req.body);

    newComment.save(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({ "_id" : req.params.id }, { "comment" : doc._id })
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(doc);
                }
            });
        }
    });
});



// listen on port 3000
app.listen(3000, function() {
    console.log("app listening on port 3000!");
});
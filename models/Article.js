// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class
var Schema = mongoose.Schema;

// Create article schema
var Article = new Schema({
    // required title
    title: {
        type: String,
        required: true
    },
    // required link
    link: {
        type: String,
        required: true
    },
    // saved
    saved: {
        type: Boolean,
        required: true,
        default: false
    }
    // eventually add comments

});

// create article model with article schema
var Article = mongoose.model("Article", Article);

// export the model
module.exports = Article;
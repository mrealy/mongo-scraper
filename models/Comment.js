// require package
var mongoose = require("mongoose");
// create schema class
var Schema = mongoose.Schema;

// Create schema for each comment
var CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    body: {
        type: String,
        required: true
    }
});

// Create model for a new comment that is using comments schema
var Comment = mongoose.model("Comment", CommentSchema);

// export Comment model
module.exports = Comment;
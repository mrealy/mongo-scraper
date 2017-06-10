// require package
var mongoose = require("mongoose");
// create schema class
var Schema = mongoose.Schema;
// Create CommentSchema schema
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
// Create Comment model with Commentschema
var Comment = mongoose.model("Comment", CommentSchema);
// export Comment model
module.exports = Comment;
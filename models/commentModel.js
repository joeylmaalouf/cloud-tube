var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
});

module.exports = mongoose.model("Comment", commentSchema, "comments");

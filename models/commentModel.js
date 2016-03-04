var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  "text": String
});

module.exports = mongoose.model("Comment", commentSchema, "comments");

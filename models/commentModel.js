var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  "time": Number,
  "text": String
});

module.exports = mongoose.model("Comment", commentSchema, "comments");

var mongoose = require("mongoose");

var videoSchema = mongoose.Schema({
  "_id": String, // custom ID because we're using the YouTube video ID
  "comments": [String]
});

module.exports = mongoose.model("Video", videoSchema, "videos");

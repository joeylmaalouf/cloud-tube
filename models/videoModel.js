var mongoose = require("mongoose");

var videoSchema = mongoose.Schema({
});

module.exports = mongoose.model("Video", videoSchema, "videos");

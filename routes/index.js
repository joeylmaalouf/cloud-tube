var path = require("path");
var Video = require("../models/videoModel");
var Comment = require("../models/commentModel");

var routes = {};

routes.home = function (req, res) {
  res.sendFile("home.html", { "root": path.join(__dirname, "../public") });
};

routes.getCommentsForVideo = function (req, res) {
  Video.findById(req.params._id, function (err, video) {
    if (err) return res.status(500).send({"error": err});
    res.json(video.comments);
  });
};

module.exports = routes;

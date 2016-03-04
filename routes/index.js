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

routes.makeVideo = function (req, res) {
  Video.create({
    "_id": req,body._id,
    "comments": []
  }, function (err, video) {
    if (err) return res.status(500).send({"error": err});
    res.json(video.toObject());
  });
};

routes.makeComment = function (req, res) {
  Comment.create(req.body, function (err, comment) {
    if (err) return res.status(500).send({"error": err});
    Video.findById(req.params._id, function (err, video) {
      if (err) return res.status(500).send({"error": err});
      video.comments.push(comment);
      video.save();
    });
    res.json(comment.toObject());
  });
};

routes.deleteComment = function (req, res) {
  Comment.findByIdAndRemove(req.body._id, function (err, comment) {
    if (err) return res.status(500).send({"error": err});
    res.json(comment.toObject());
  });
};

module.exports = routes;

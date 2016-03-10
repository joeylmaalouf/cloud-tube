var path = require("path");
var Video = require("../models/videoModel");

var routes = {};

routes.home = function (req, res) {
  res.sendFile("main.html", { "root": path.join(__dirname, "../public") });
};

routes.getCommentsForVideo = function (req, res) {
  Video.findById(req.params._id, function (err, video) {
    if (err) return res.status(500).send({"error": err});
    res.json(video ? video.comments : []);
  });
};

routes.makeVideo = function (req, res) {
  Video.count({"_id": req.body._id}, function (err, count) {
    if (!count) {
      Video.create({
        "_id": req.body._id,
        "comments": []
      }, function (err, video) {
        if (err) return res.status(500).send({"error": err});
        res.json(video.toObject());
      });
    }
    else {
      res.json(req.body);
    }
  });
};

routes.makeComment = function (req, res) {
  if (!req.isAuthenticated()) {
    res.status(401).send({"error": "401"});
    return;
  }
  var comment = {
    "time": req.body.time,
    "text": req.body.text,
    "author": req.session.passport.user.username
  };
  Video.findById(req.body._id, function (err, video) {
    if (err) return res.status(500).send({"error": err});
    video.comments.push(comment);
    video.comments.sort(function (a, b) {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;
      return 0;
    });
    video.save();
    res.json(video.comments);
  });
};

routes.deleteComment = function (req, res) {
  if (!req.isAuthenticated() || req.session.passport.user.username !== req.body.author) {
    res.status(401).send({"error": "401"});
    return;
  }
  Video.findById(req.body._id, function (err, video) {
    if (err) return res.status(500).send({"error": err});
    video.comments.forEach(function (elem, ind, arr) {
      if (elem.time === req.body.time && elem.text === req.body.text) {
        arr.splice(ind, 1);
      }
    });
    video.save();
    res.json(req.body);
  });
};

module.exports = routes;

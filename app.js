var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var index = require("./routes/index");
var config = require("./oauth.js");
var session = require("express-session");
var passport = require("passport");
var GithubStrategy = require("passport-github").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var app = express();

var MONGOURI = process.env.MONGOURI || "mongodb://localhost/test";
var PORT = process.env.PORT || 3000;

mongoose.connect(MONGOURI);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "top secret", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", index.home);
app.get("/getCommentsForVideo/:_id", index.getCommentsForVideo);
app.post("/makeVideo", index.makeVideo);
app.post("/makeComment", index.makeComment);
app.put("/deleteComment", index.deleteComment);
app.get(
  "/auth/github",
  passport.authenticate("github", {scope: ["user:email"]}),
  function (req, res) {}
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/");
  }
);
app.get(
  "/logout",
  function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  }
);
app.get("/loggedIn",
  function (req, res) {
  	res.json({
      "isAuth": req.isAuthenticated(),
      "name": req.isAuthenticated() ? req.session.passport.user.username : null
    });
});

//You should have a * route that serves the main html file.
app.listen(PORT, function () {
  console.log("Application running on port:", PORT);
});

// Main clientside javascript file
// Contains main angular controller which handles all rendering and requests

var app = angular.module("cloud-tube", ["ngRoute", "ngAnimate", "ui.bootstrap.contextMenu", "luegg.directives"]);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    templateUrl : "../views/home.html",
    controller: "mainController"
  });

  $locationProvider.html5Mode(true);
});

app.controller("mainController", function ($scope, $http, $interval) {
  $scope.comments = [];
  $scope.currentVideoID = "";
  $scope.currentVideoTime = 0;
  $scope.formText = "";
  $scope.loggedIn = false;
  $scope.username = "";
  $scope.setVideo = function (videoID) {
    $scope.currentVideoID = videoID;
    if (player) {
      player.loadVideoById($scope.currentVideoID);
    }
    $http.post("/makeVideo", {
      "_id": $scope.currentVideoID
    }).then(
      function (res) {},
      function (err) { console.log(err); }
    );
    $http.get("/getCommentsForVideo/" + $scope.currentVideoID).then(
      function (res) {
        $scope.comments = res.data;
        $scope.currentVideoTime = 0;
      },
      function (err) { console.log(err); }
    );
    $interval(function () { if (player && player.getCurrentTime) $scope.currentVideoTime = player.getCurrentTime(); }, 100);
  };
  $scope.submitComment = function () {
    if ($scope.formText) {
      $http.post("/makeComment", {
        "_id": $scope.currentVideoID,
        "time": player.getCurrentTime(),
        "text": $scope.formText
      }).then(
        function (res) { $scope.comments = res.data; },
        function (err) { console.log(err); }
      );
      $scope.formText = "";
    };
  };
  $scope.deleteComment = function (comment) {
    comment._id = $scope.currentVideoID;
    $http.put("/deleteComment", comment).then(
      function (res) {
        $scope.comments.forEach(function (elem, ind, arr) {
          if (elem.author === comment.author && elem.time === comment.time && elem.text === comment.text) {
            arr.splice(ind, 1);
          }
        });
      },
      function (err) { console.log(err); }
    );
  };
  $scope.auth = function () {
    window.location.href = $scope.loggedIn ? "/logout" : "/auth/github";
  };
  $http.get("/loggedIn").then(
    function (res) {
      $scope.loggedIn = res.data.isAuth;
      $scope.username = res.data.name || "Guest";
    },
    function (err) { console.log(err); }
  );
  $scope.commentOptions = [
    ["Delete", function ($commentScope) {
      $scope.deleteComment($commentScope.comment);
    }]
  ];
  $scope.setVideo("dQw4w9WgXcQ");
});

app.directive("ngEnterKeyPressed", function () {
  return function ($scope, $element, $attrs) {
    $element.bind("keydown keypress", function (event) {
      var keyCode = event.which || event.keyCode;

      // If enter key is pressed
      if (keyCode === 13) {
        url = $($element).val();
        if (url.indexOf("list") > 0) { // Trim the url to get rid of url parameters
          url = url.substr(0, url.indexOf("list") - 1);
        }

        // Grab id of video via regex (http://stackoverflow.com/questions/10591547/how-to-get-youtube-video-id-from-url)
        var videoID = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoID != null) {
          $scope.setVideo(videoID[1]);
        } else { 
          console.log("The provided YouTube URL is not valid.");
        }
        event.preventDefault();
      }

    });
  };
});

// Select content when element gets focus (handy for pasting in urls)
// (http://stackoverflow.com/questions/14995884/select-text-on-input-focus)
app.directive("selectOnClick", ["$window", function ($window) {
  return {
    restrict: "A",
    link: function ($scope, $element, $attrs) {
      $element.on("click", function () {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length)
        }
      });
    }
  };
}]);

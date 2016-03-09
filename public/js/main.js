// Main clientside javascript file
// Contains main angular controller which handles all rendering and requests

var comments = ['comment 1', 'comment 2', 'comment 3', 'comment 4', 'comment 5', 'comment 6', 'comment 7'];
var displayNum = 4;
var nextComment = displayNum-1;
var totalComments = comments.length;
var app = angular.module("cloud-tube", ["ngRoute"]);
var comments_offset = 0;

function animateCommentsList(time) {
	comments_offset += 15;
	time_in_seconds = time/1000;
	$('.comments').css('-webkit-transition', time_in_seconds + 's ease-in-out');
	$('.comments').css('-webkit-transform', 'translate(0px, -' + comments_offset + 'px)');
	
	setTimeout(function() {
		$('.comments').children().first().remove();
		comments_offset -= 15;
		$('.comments').css('-webkit-transition', 'none');
		$('.comments').css('-webkit-transform', 'translate(0px, ' + comments_offset + 'px)');	}, time);
}

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    templateUrl : "../views/home.html",
    controller: "mainController"
  });

  $locationProvider.html5Mode(true);
});

app.controller("mainController", function ($scope, $http) {
	$scope.cycleComments = function() {
		nextComment += 1;
		console.log(nextComment);
		if (nextComment == totalComments) {
			nextComment = 0;
		}
		console.log($('.comments').children());

		$("<div>" + comments[nextComment] + "</div>").insertAfter($('.comments').children().last());
		animateCommentsList(1000);
	}

	for (var i = 0; i < displayNum; i++) {
		$("<div>" + comments[i] + "</div>").insertAfter($('.comments').children().last());
	}
	$('.comments').children().first().remove();
});

app.directive("ngEnterKeyPressed", function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      var keyCode = event.which || event.keyCode;

      // If enter key is pressed
      if (keyCode === 13) {
        url = $(element).val();
        if (url.indexOf("list") > 0) { // Trim the url to get rid of url parameters
          url = url.substr(0, url.indexOf("list")-1);
        }

        // Grab id of video via regex (http://stackoverflow.com/questions/10591547/how-to-get-youtube-video-id-from-url)
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoid != null) {
          console.log("video id = ", videoid[1]);
          console.log("Setting video id to: ", videoid[1]);
          player.loadVideoById(videoid[1]);
        } else { 
          console.log("The youtube url is not valid.");
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
    link: function (scope, element, attrs) {
      element.on("click", function () {
        if (!$window.getSelection().toString()) {
          // Required for mobile Safari
          this.setSelectionRange(0, this.value.length)
        }
      });
    }
  };
}]);

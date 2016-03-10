// Main clientside javascript file
// Contains main angular controller which handles all rendering and requests

var comments = ['comment 1', 'comment 2', 'comment 3', 'comment 4', 'comment 5', 'comment 6', 'comment 7']; // todo: draw from api
var displayNum = 6; // Number of comments to display at one time
var nextComment = displayNum-1;
var totalComments = comments.length;
var app = angular.module("cloud-tube", ["ngRoute"]);
var comments_offset = 0; // Net offset of comments div (translations don't stack)
var comment_height = 35; // Height of one comment div (todo, make this not hardcoded)
var deleteCommentById; // Function stub

// Given a timestep, scroll to the next comment
function animateCommentsList(comment, time) {
	$(genCommentHTML(comment)).insertAfter($('.comments').children().last()); // Append comment to end of comments list
	comments_offset += comment_height;
	time_in_seconds = time/1000.0; // Calc time in seconds for css animation
	$('.comments').css('-webkit-transition', time_in_seconds + 's ease-in-out'); // Establish animation protocol
	$('.comments').css('-webkit-transform', 'translate(0px, -' + comments_offset + 'px)'); // Translate the comments div up by the height of one comment
	
	setTimeout(function() {
		$('.comments').children().first().remove(); // Remove first comment as it has scrolled out of view
		comments_offset -= comment_height; // Quickly shift the comments div down by one comment to compensate for loss of top comment
		$('.comments').css('-webkit-transition', 'none'); // Make the translation instantaneous so noone notices
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
		animateCommentsList("my Comment", 200); // timeframe (in millis) for comment shift animation
	}

	deleteCommentById = function() {
		console.log('todo'); // todo: make this work
	}

	$scope.comments = [];
	$scope.currentVideoID = "";
	$scope.formText = "";
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
			function (res) { $scope.comments = res.data; },
			function (err) { console.log(err); }
		);
	};
	$scope.submitComment = function () {
		if ($scope.formText) {
			$http.post("/makeComment", {
			"_id": $scope.currentVideoID,
			"time": player.getCurrentTime(),
			"text": $scope.formText
		}).then(
			function (res) { $scope.comments.push(res.data); },
			function (err) { console.log(err); }
		);
		$scope.formText = "";
		};
	};
	$scope.setVideo("dQw4w9WgXcQ");
	initComments();
});

// Generate comment div html from comment content
function genCommentHTML(comment) {
	return "<div><div class='comment_text'>" + comment + "</div><div class='delete_button' onclick='deleteCommentById()'>x</div></div>";
}

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

// Initialize comments div
function initComments() {
	for (var i = 0; i < displayNum; i++) {
		var comm = comments[i];
		if (comm != undefined)
		$(genCommentHTML(comm)).insertAfter($('.comments').children().last());
	}
	$('.comments').children().first().remove();
	$('.comments_wrapper').first().css('height', displayNum * comment_height);
}

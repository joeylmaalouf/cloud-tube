// Main clientside javascript file
// Contains main angular controller which handles all rendering and requests

var comments = ['comment 1', 'comment 2', 'comment 3', 'comment 4', 'comment 5', 'comment 6', 'comment 7'];
var displayNum = 4;
var nextComment = displayNum-1;
var totalComments = comments.length;
var app = angular.module("cloud-tube", ["ngRoute"]);
var comments_offset = 0;
var comment_height = 35;
var deleteCommentById;

function animateCommentsList(time) {
	comments_offset += comment_height;
	time_in_seconds = time/1000;
	$('.comments').css('-webkit-transition', time_in_seconds + 's ease-in-out');
	$('.comments').css('-webkit-transform', 'translate(0px, -' + comments_offset + 'px)');
	
	setTimeout(function() {
		$('.comments').children().first().remove();
		comments_offset -= comment_height;
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

		$(genCommentHTML(comments[nextComment])).insertAfter($('.comments').children().last());
		animateCommentsList(1000);
	}

	deleteCommentById = function() {
		console.log('todo');
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
				// Required for mobile Safari
				this.setSelectionRange(0, this.value.length)
			}
		});
		}
	};
}]);

function initComments() {
	for (var i = 0; i < displayNum; i++) {
		$(genCommentHTML(comments[i])).insertAfter($('.comments').children().last());
	}
	$('.comments').children().first().remove();
}

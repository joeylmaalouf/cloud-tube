<<<<<<< HEAD:public/js/main.js
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', { // Inject player into div with id 'player'
  height: '390',
  width: '640',
  videoId: 'M7lc1UVf-VE',
  events: {
    'onReady': onPlayerReady,
    'onStateChange': onPlayerStateChange
  }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
  setTimeout(stopVideo, 6000);
  done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}
=======
// Main clientside javascript file
// Contains main angular controller which handles all rendering and requests

var app = angular.module('wikiApp', ['ngRoute']);

function fetchPages() {}; // Function stubs
function resetContent() {};
function resetControls() {};

app.config(function($routeProvider, $locationProvider){

  $routeProvider

	.when("/",
	{
		templateUrl : '../views/wrapper.html',
    	controller: "mainController"
    })

    $locationProvider.html5Mode(true);
});

app.controller('mainController', function($scope, $sce, $http, $location){
	$scope.pages = [];
	$scope.$sce = $sce;
	// Fill out function stubs
	fetchPages = function() {
		$http.get('./pages').then(function success(res) {
			$scope.pages = res.data.reverse();
		}, function error(err) {
			console.log(err);
		});
	};

	// Request the server to create a new page
	$scope.addPage = function(author) { 
		if ($scope.newpageTitle == undefined || $scope.newpageContent == undefined) {
			return;
		}

		// Inject page controls into page content
		data = {"title": $scope.newpageTitle, "content": $scope.newpageContent, "author": author, "timestamp": new Date().getTime()};
		$http.post('./pages/new', JSON.stringify(data)).then(function success(res) {
			fetchPages(); // Refresh page list
			resetContent(); // Reset menu to show blank page
			resetControls(); // Reset the controls to show blank page
		}, function error(err) {
			console.log(err);
		});
	};

	// Request the server to delete a page
	$scope.deletePage = function(id) {
		$http.delete('./pages/byid/' + id + '/delete').then(function success(res) {
			fetchPages();
			resetContent(); // Reset menu to show blank page
			resetControls();
		}, function error(err) {
			console.log(err);
		});
	};

	// Request the content of a page from the server
	$scope.fetchPageContent = function(id) {
		$http.get('./pages/byid/' + id).then(function success(res) {
			// Capture content from response
			var content = res.data.content;

			// Inject sanitized html
			$scope.pagecontent = $sce.trustAsHtml(content);

			// Set app vars to keep track of what page we are on
			$scope.current_page_content = content;
			$scope.current_page_title = res.data.title;
			$scope.current_page_id = id;
			// Display page controls (edit/remove)
			$scope.controls = 'pageControls';
		}, function error(err) {
			console.log(err);
		});
	}

	// Reset the content div to show nothing
	resetContent = function() {
		$scope.pagecontent = "";
	}

	// MAKE THE CONTROLS DISAPPEAR
	resetControls = function() {
		$scope.controls = "";
	}

	// Initial fetch
	fetchPages();
});
>>>>>>> e8086785ea065508fb5d65932e61a4c498007f7d:public/scripts/main.js

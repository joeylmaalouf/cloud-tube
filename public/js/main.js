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

var app = angular.module('cloudtube', ['ngRoute']);

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
	
});
>>>>>>> e8086785ea065508fb5d65932e61a4c498007f7d:public/scripts/main.js

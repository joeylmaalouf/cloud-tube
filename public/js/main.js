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

app.directive('ngEnterKeyPressed', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 13) {
        		url = $(element).val();
        		if (url.indexOf('list') > 0) { // Trim the url to get rid of url parameters
        			url = url.substr(0, url.indexOf('list')-1);
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

module.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);

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

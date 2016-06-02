// user.js

'use strict';

//import require components
var $ = require('jquery-browserify');
var angular = require('angular');
var angular_route = require('angular-route');
//var sugar = require('sugar');

var app = angular.module('app', ['ngRoute']);


app.controller('MenuController', function($scope, $route){
	$scope.$route = $route;
});

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	
	$locationProvider.html5Mode(true);
	
	$routeProvider
		.when('/userIndex', {
			templateUrl: 'html/userIndex.html',
			controller: 'UserIndexController'
		})
		.when('/delAddress', {
			templateUrl: 'html/delAddress.html',
			controller: 'DelAddressController'
		})
		.when('/boundPhone', {
			templateUrl: 'html/boundPhone.html',
			controller: 'BoundPhoneController'
		})
		.when('/updateAddress', {
			templateUrl: 'html/updateAddress.html',
			controller: 'UpdateAddressController'
		})
		.when('/newAddress', {
			templateUrl: 'html/newAddress.html',
			controller: 'NewAddressController'
		})
		.when('/error', {
			templateUrl: 'html/error.html',
			controller: 'ErrorController'
		});		
}]);

app.controller('UserIndexController',function(){
	
});

app.controller('DelAddressController',function(){
	
});

app.controller('UpdateAddressController', function(){
	alert('1');
});
app.controller('NewAddressController', function(){
	alert('1');
});

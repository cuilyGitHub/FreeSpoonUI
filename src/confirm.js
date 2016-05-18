// confirm.js

'use strict';

//import require components
var angular = require('angular');
var sugar = require('sugar');

var app = angular.module('app');

app.controller('MainController', function($scope,$http){
	$http.post('../assets/json/confirm.json',{
		oopenId:'',
		batchId:'',
		courierId:''
	})
	.success(function(data){
		$scope.confirmInfo=data;
	})
	.error(function(){
		
	})
});

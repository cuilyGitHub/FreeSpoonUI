// confirm.js

'use strict';

//import require components
var angular = require('angular');

// local modules
var utils = require('./modules/utils');
var registerServices = require('./modules/services');
var registerFilters = require('./modules/filters');
var registerControllers = require('./modules/controllers');

var app = angular.module('app',[]);

// register angular components
registerServices(app);
registerFilters(app);
registerControllers(app);

app.controller('MainController', function($scope, $data){
	$data.requestConfirm(function(data){
		if(!data){
			//TODO redirect to error page
		} else {
			$scope.data = data;
		}
	});
});

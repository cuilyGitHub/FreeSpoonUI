// appMenu.js

'use strict';

//import require components
var angular = require('angular');
var sugar = require('sugar');

var app = angular.module('app', []);


app.filter('date',function(){
		return function(val){
			var date = new Date();
			if(!!val){
				date = Date.create(val)/1000;
			}
			return date.format('long', 'zh-CN');
		}
	});

app.config(function($locationProvider){
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});
});	
	
app.controller('OpusController', function($location, $scope, $http){
	var id=$location.search();
	if(!id.CookDataId || !id.CookDataId){
		alert('id不存在');
		return;
	}
	id=JSON.stringify(id);
	$http.post('http://www.yijiayinong.com/cookbook/api/user/getshareproduct',id)
	.success(function(data){
		if(!data.message=='get_success'){
			return;
		}
		$scope.cooks=data.result.products;
	});
	
	$http.post('http://www.yijiayinong.com/cookbook/api/user/getmorecuisine',id)
	.success(function(data){
		if(data.message!='get_success'){
			return;
		}
		$scope.moredata=data.result.cuisinebooks;
	});
	$scope.jump=function(data){
		$location.search({CookerId:data.kBCookerId,CookDataId:data.kBCookBookId});
		window.location.reload();
	}
});
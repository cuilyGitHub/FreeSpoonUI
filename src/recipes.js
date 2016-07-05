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

app.controller('MenuController', function($location, $scope, $http){
	var id=$location.search().recipesId;
	if(!id){
		alert('id不存在');
		return;
	}
	$http({
			method:'get',
			url:'http://yijiayinong.com/api/business/recipes/',
			data:requestData,
			headers:{'Authorization':'JWT '+ $rootScope.auth.token}
		})
	.success(function(data){
		if(!data.message=='get_success'){
			return;
		}
		$scope.cooks=data.result.cuisinebooks;
	});

	/*$http.post('http://www.yijiayinong.com/cookbook/api/user/getmorecuisine',id)
	.success(function(data){
		if(!data.message=='get_success'){
			return;
		}
		$scope.moredata=data.result.cuisinebooks;
	});
	$scope.jump=function(data){
		$location.search({CookerId:data.kBCookerId,CookDataId:data.kBCookBookId});
		window.location.reload();
	}*/
});
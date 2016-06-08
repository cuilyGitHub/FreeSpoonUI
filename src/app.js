// app.js

'use strict';

//import require components
var $ = require('jquery-browserify');
var angular = require('angular');
var angular_route = require('angular-route');
var sugar = require('sugar');

// local modules
var utils = require('./modules/utils');
var registerServices = require('./modules/services');
var registerFilters = require('./modules/filters');
var registerControllers = require('./modules/controllers');

var app = angular.module('app', ['ngRoute']);

// register angular components
registerServices(app);
registerFilters(app);
registerControllers(app);

app.controller('MenuController', function($scope, $route){
	$scope.$route = $route;
});

app.config(function($routeProvider, $locationProvider){
	
	$locationProvider.html5Mode(true);
	
	$routeProvider
		.when('payment',{
			templateUrl: 'html/payment.html',
			controller: 'PaymentController',
		})
		.when('record',{
			templateUrl: 'html/record.html',
			controller: 'RecordController',
		})
		.when('goodsDetails',{
			templateUrl: 'html/goodsDetails.html',
			controller: 'GoodsDetailsController',
		})
		.when('freeIndex',{
			templateUrl: 'html/freeIndex.html',
			controller: 'FreeIndexController',
		})
		.when('/', {
			templateUrl: 'html/index.html',
			controller: 'IndexController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.requestBatch(function(data){
						$rootScope.load = false;
						if(!data){
							$data.preData={
								title:'参数错误',
								desc:'未知的团购批次！'
							}
							$location.path("/error");
							deferred.resolve(null);
							return;
						}
						deferred.resolve(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/checkout/:batchId', {
			templateUrl: 'html/checkout.html',
			controller: 'CheckController',
			resolve:{
				checkoutInfo: ['$q', '$location', '$data', '$rootScope', '$route', function($q, $location, $data, $rootScope, $route){
					if(!$route.current.params.batchId){
						$data.preData={
								title:'参数错误',
								desc:'参数不存在'
							}
						$location.path("/error");
						return;
					}
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.requestCheckoutInfo($route.current.params.batchId, function(data){
						$rootScope.load = false;
						if(!data){
							$data.preData={
								title:'参数错误',
								desc:'参数不存在'
							}
							$location.path("/error");
							deferred.resolve(null);
							return;
						}
					    deferred.resolve(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/order/:orderId', {
			templateUrl: 'html/order.html',
			controller: 'OrderController',
			resolve:{
				orderInfo: ['$q', '$location', '$data', '$rootScope', '$route', function($q, $location, $data, $rootScope, $route){
					if(!$route.current.params.orderId){
						$data.preData={
								title:'参数错误',
								desc:'参数不存在'
						}
						$location.path("/error");
						return;
					}
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.requestOrder($route.current.params.orderId, function(data){
						$rootScope.load = false;
						if(!data){
							$data.preData={
								title:'参数错误',
								desc:'参数不存在'
							}
							$location.path("/error");
							deferred.resolve(null);
							return;
						}
					    deferred.resolve(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/share/:orderId', {
			templateUrl: 'html/share.html',
			controller: 'ShareController',
			resolve: {
				orderId: ['$route', function($route){
					return $route.current.params.orderId;
				}]
			}
		})
		.when('/orders', {
			templateUrl: 'html/orders.html',
			controller: 'OrdersController',
			resolve:{
				orders: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.requestOrders(function(data){
						$rootScope.load = false;
						if(!data){
							$data.preData={
								title:'参数错误',
								desc:'参数不存在'
							}
							$location.path("/error");
							deferred.resolve(null);
							return;
						}
					    deferred.resolve(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/error', {
			templateUrl: 'html/error.html',
			controller: 'ErrorController'
		});		
});

(function initWXConfig(angular){
	var cfg = {
		url: window.location.href,
		jsApiList: ['chooseWXPay', 'onMenuShareAppMessage', 'closeWindow']
	};
	$.ajax({
		type: 'POST',
		url: 'http://yijiayinong.com/api/wxConfig',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(cfg),
		dataType: 'json',
		success: function(data){
			if(!data || data.errcode != 'Success'){
				return;
			}
			if(!data.res || !data.res.wxConfig){
				return;
			}
			wx.config(data.res.wxConfig);
			wx.ready(function(){
				function onBridgeReady(){
					angular.bootstrap(document, ['app']);
				}
				if (typeof WeixinJSBridge == "undefined"){
					if( document.addEventListener ){
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					}else if (document.attachEvent){
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					}
				}else{
					onBridgeReady();
				}
			});
		},
		error: function(){
			//TODO
		},
		complete: function(){
			//TODO
		}
	});
	
})(angular);

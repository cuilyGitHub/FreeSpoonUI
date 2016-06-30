// app.js

'use strict';

//import require components
var $ = require('jquery-browserify');
var angular = require('angular');
var angular_route = require('angular-route');
var sugar = require('sugar');
var ngResource = require('angular-resource');

// local modules
var utils = require('./modules/utils');
var registerServices = require('./modules/services');
var registerFilters = require('./modules/filters');
var registerFactorys = require('./modules/factorys');

// controllers modules
var registerCheckout = require('./modules/controllers/checkout');
var registerError = require('./modules/controllers/error');
var registerFreeIndex = require('./modules/controllers/freeIndex');
var registerGoodsDetails = require('./modules/controllers/goodsDetails');
var registerIndex = require('./modules/controllers/index');
var registerOrder = require('./modules/controllers/order');
var registerOrders = require('./modules/controllers/orders');
var registerPayMent = require('./modules/controllers/payMent');
var registerRecord = require('./modules/controllers/record');
var registerShare = require('./modules/controllers/share');
var registerAuth = require('./modules/controllers/auth');

var app = angular.module('app', ['ngRoute','ngResource']);

// register angular components
registerServices(app);
registerFilters(app);
registerFactorys(app);

//register controllers
registerCheckout(app);
registerError(app);
registerFreeIndex(app);
registerGoodsDetails(app);
registerIndex(app);
registerOrder(app);
registerOrders(app);
registerPayMent(app);
registerRecord(app);
registerShare(app);
registerAuth(app);

app.controller('MenuController', function($scope, $route){
	$scope.$route = $route;
});

app.config(function($routeProvider, $locationProvider,$httpProvider){
	$locationProvider.html5Mode(true);
	
	$routeProvider
		//get token
		.when('/', {
			templateUrl: 'html/auth.html',
			controller: 'AuthController',
			resolve: {
				auth: ['$q', '$location', '$rootScope','authRes', function($q, $location,$rootScope,authRes){
						var code = $location.search().code;
						var deferred = $q.defer();
						authRes.save({},{code:code},function(data,headers){
							$rootScope.load = false;
							deferred.resolve(data);
						},function(data,headers){
							deferred.reject(data);
						});
						return deferred.promise;
				}]
			}
		})
		//
		.when('/freeIndex', {
			templateUrl: 'html/freeIndex.html',
			controller: 'FreeIndexController',
			resolve: {
				batch: ['$q', '$location', '$data','$rootScope', 'bulksRes', function($q, $location, $data, $rootScope, bulksRes){
						$rootScope.load = true;
						var deferred = $q.defer();
						bulksRes.charge({search:$rootScope.search},function(data,headers){
							$rootScope.load = false;
							deferred.resolve(data);
						},function(data,headers){
							deferred.reject(data);
						});
						return deferred.promise;	
				}]
			}
		})
		.when('/index', {
			templateUrl: 'html/index.html',
			controller: 'IndexController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', 'bulkRes', '$shopCart', function($q, $location, $data, $rootScope, bulkRes, $shopCart){
					$rootScope.load = true;
					var deferred = $q.defer();
					if($shopCart.shopCartData && $rootScope.id == $shopCart.shopCartData.id){
						$rootScope.load = false;
						deferred.resolve($shopCart.shopCartData);
						return deferred.promise;
					}else{
						bulkRes.charge({batch:$rootScope.id},function(data,headers){
							$rootScope.load = false;
							deferred.resolve(data);
						},function(data,headers){
							deferred.reject(data);
						});
						return deferred.promise;
					}
				}]
			}
		})
		.when('/checkout', {
			templateUrl: 'html/checkout.html',
			controller: 'CheckController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', 'bulkRes', '$shopCart', function($q, $location, $data, $rootScope, bulkRes, $shopCart){
					$rootScope.load = true;
					var deferred = $q.defer();
					if($shopCart.shopCartData && $rootScope.id == $shopCart.shopCartData.id){
						$rootScope.load = false;
						deferred.resolve($shopCart.shopCartData);
						return deferred.promise;
					}else{
						bulkRes.charge({batch:$rootScope.id},function(data,headers){
							$rootScope.load = false;
							deferred.resolve(data);
						},function(data,headers){
							deferred.reject(data);
						});
						return deferred.promise;
					}
				}]
			}
		})
		.when('/order', {
			templateUrl: 'html/order.html',
			controller: 'OrderController',
			resolve:{
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.orderRequest($rootScope.orderUrl, function(data){
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
		.when('/share', {
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
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', 'orders', function($q, $location, $data, $rootScope, orders){
					$rootScope.load = true;
					var deferred = $q.defer();
					orders.charge({},function(data){
						$rootScope.load = false;
						deferred.resolve(data);
					},function(data,headers){
						deferred.reject(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/payment',{
			templateUrl: 'html/payment.html',
			controller: 'PaymentController',
			resolve:{
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.orderRequest($rootScope.orderUrl, function(data){
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
		.when('/record',{
			templateUrl: 'html/record.html',
			controller: 'RecordController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', 'historys',  function($q, $location, $data, $rootScope, historys){
					$rootScope.load = true;
					var deferred = $q.defer();
					historys.charge({},function(data){
						$rootScope.load = false;
						deferred.resolve(data);
					},function(data,headers){
						deferred.reject(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/goodsDetails',{
			templateUrl: 'html/goodsDetails.html',
			controller: 'GoodsDetailsController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', 'products', function($q, $location, $data, $rootScope, products){
					$rootScope.load = true;
					var deferred = $q.defer();
					products.charge({},function(data){
						$rootScope.load = false;
						deferred.resolve(data);
					},function(data,headers){
						deferred.reject(data);
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
		url: 'http://yijiayinong.com/api/business/wxConfig',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(cfg),
		dataType: 'json',
		success: function(data){
			if(!data){
				return;
			}
			wx.config(data);
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


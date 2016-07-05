// user.js

'use strict';

//import require components
var $ = require('jquery-browserify');
var angular = require('angular');
var angular_route = require('angular-route');
var sugar = require('sugar');
var ngResource = require('angular-resource');

// controllers modules
var registerServices = require('./modules/services');
var registerFactorys = require('./modules/factorys');
var registerFilters = require('./modules/filters');

// controllers modules
var registerOrders = require('./modules/controllers/orders');
var registerError = require('./modules/controllers/error');
var registerOrder = require('./modules/controllers/order');
var registerPayMent = require('./modules/controllers/payMent');
var registerShare = require('./modules/controllers/share');

var register_user_center = require('./modules/controllers/user_center');
var register_update_address = require('./modules/controllers/update_address');
var register_del_address = require('./modules/controllers/del_address');
var register_bound_phone = require('./modules/controllers/bound_phone');
var register_new_address = require('./modules/controllers/new_address');

var app = angular.module('app', ['ngRoute','ngResource']);

//register controllers
registerServices(app);
registerFactorys(app);
registerFilters(app);

//register controllers
registerOrders(app);
registerError(app);
registerOrder(app);
registerPayMent(app);
registerShare(app);

register_user_center(app);
register_update_address(app);
register_del_address(app);
register_bound_phone(app);
register_new_address(app);

app.controller('MenuController', function($scope, $route){
	$scope.$route = $route;
});

app.config(function($routeProvider, $locationProvider,$httpProvider){
	
	$locationProvider.html5Mode(true);
	
	$routeProvider
		.when('/user_center', {
			templateUrl: 'html/user/user_center.html',
			controller: 'user_center_controller',
			resolve: {
				auth: ['$q', '$location', '$rootScope','authRes', function($q, $location,$rootScope,authRes){
					alert('_user');
						var code = $location.search().code;
						var deferred = $q.defer();
						if($rootScope.auth){
							alert('_user_1');
							deferred.resolve($rootScope.auth);
							return deferred.promise;
						}else{
							alert('_user_2');
							authRes.save({},{code:code},function(data){
								console.log(data);
								deferred.resolve(data);
							},function(data,headers){
								deferred.reject(data);
							});
							return deferred.promise;
						}
						
				}]
			}
		})
		.when('/update_address', {
			templateUrl: 'html/user/update_address.html',
			controller: 'update_address_controller',
			resolve: {
				data: ['$q', 'address', function($q, address){
					alert(1);
					var deferred = $q.defer();
					address.charge({},function(data){
					alert(JSON.stringify(data));
						deferred.resolve(data);
					},function(data){
					alert(JSON.stringify(data));
						deferred.resolve(data);
					});
					alert(4);
					return deferred.promise;
				}]
			}
		})
		.when('/del_address', {
			templateUrl: 'html/user/del_address.html',
			controller: 'del_address_controller',
			resolve: {
				data: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					var deferred = $q.defer();
					$data.get_address($data.address_id,function(data){
						deferred.resolve(data);
					},function(data,headers){
						deferred.reject(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/bound_phone', {
			templateUrl: 'html/user/bound_phone.html',
			controller: 'bound_phone_controller'
		})
		.when('/new_address', {
			templateUrl: 'html/user/new_address.html',
			controller: 'new_address_controller'
		})
		.when('/error', {
			templateUrl: 'html/error.html',
			controller: 'ErrorController'
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
		.when('/payment',{
			templateUrl: 'html/payment.html',
			controller: 'PaymentController',
			resolve:{
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					var deferred = $q.defer();
					$data.orderRequest($rootScope.orderUrl, function(data){
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
		.when('/share', {
			templateUrl: 'html/share.html',
			controller: 'ShareController',
			resolve: {
				orderId: ['$route', function($route){
					return $route.current.params.orderId;
				}]
			}
		})
		.otherwise({
			templateUrl: 'html/user/user_center.html',
			controller: 'user_center_controller',			
			resolve: {
				auth: ['$q', '$location', '$rootScope','authRes', function($q, $location,$rootScope,authRes){
					alert('user_center');
						var code = $location.search().code;
						var deferred = $q.defer();
						alert('user_1');
						if($rootScope.auth){
							alert('user_2');
							deferred.resolve($rootScope.auth);
							return deferred.promise;
						}else{
							alert('user_3');
							authRes.save({},{code:code},function(data){
								alert(JSON.stringify(data));
								deferred.resolve(data);
							},function(data,headers){
								alert(JSON.stringify(data));
								deferred.reject(data);
							});
							alert('user_4');
							return deferred.promise;
						}
						
				}]
			}
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

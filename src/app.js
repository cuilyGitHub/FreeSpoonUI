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

//user controllers modules
var register_user_center = require('./modules/controllers/user_center');
var register_update_address = require('./modules/controllers/update_address');
var register_del_address = require('./modules/controllers/del_address');
var register_bound_phone = require('./modules/controllers/bound_phone');
var register_new_address = require('./modules/controllers/new_address');

//app share controllers modules
var register_recipes = require('./modules/controllers/recipes');
var register_dishs = require('./modules/controllers/dishs');

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

//register user controllers
register_user_center(app);
register_update_address(app);
register_del_address(app);
register_bound_phone(app);
register_new_address(app);

//register appshare controllers
register_recipes(app);
register_dishs(app);

app.controller('MenuController', function($scope, $route){
	$scope.$route = $route;
});

app.config(function($routeProvider, $locationProvider,$httpProvider,$resourceProvider){
	$locationProvider.html5Mode(true);
	$resourceProvider.defaults.stripTrailingSlashes = false;
	
	$routeProvider
		//get token
		.when('/', {
			templateUrl: 'html/auth.html',
			controller: 'AuthController',
			resolve: {
				auth: ['$q', '$location', '$rootScope','authRes', function($q, $location,$rootScope,authRes){
						$rootScope.load = true;
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
		.when('/freeIndex', {
			templateUrl: 'html/freeIndex.html',
			controller: 'FreeIndexController',
			resolve: {
				batch: ['$q', '$location', '$data','$rootScope',  function($q, $location, $data, $rootScope){
						$rootScope.load = true;
						var deferred = $q.defer();
						$data.authRes(function(data){
							if(!data){
								$data.preData={
									title:'参数错误',
									desc:'参数不存在'
								}
								$location.path("/error");
								return;
							}
							$rootScope.auth = data;
							if($rootScope.search){
								$data.searchRes($rootScope.search,function(data){
									deferred.resolve(data);
								})
							}else{
								$data.bulksRes(function(data){
									deferred.resolve(data);
								})
							}
						});
						return deferred.promise;
						
				}]
			}
		})
		.when('/index', {
			templateUrl: 'html/index.html',
			controller: 'IndexController',
			resolve: {
				batch: ['$q', '$location', '$data','$rootScope', '$shopCart',  function($q, $location, $data, $rootScope, $shopCart){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.authRes(function(data){
							if(!data){
								$data.preData={
									title:'参数错误',
									desc:'参数不存在'
								}
								$location.path("/error");
								return;
							}
							$rootScope.auth = data;
							if(!$rootScope.id){
								$rootScope.id = $location.search().state;
							}
							$data.bulkRes($rootScope.id,function(data){
								if($shopCart.shopCartData &&$shopCart.shopCartData.id === data.id){
									deferred.resolve($shopCart.shopCartData);
									return;
								}
								deferred.resolve(data);
							})
					});
					return deferred.promise;
				}]
			}
		})
		.when('/goodsDetails',{
			templateUrl: 'html/goodsDetails.html',
			controller: 'GoodsDetailsController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.products($rootScope.productsId,function(data){
						$rootScope.load = false;
						deferred.resolve(data);
					},function(data,headers){
						deferred.reject(data);
					});
					return deferred.promise;
				}]
			}
		})
		.when('/checkout', {
			templateUrl: 'html/checkout.html',
			controller: 'CheckController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', '$shopCart', function($q, $location, $data, $rootScope, $shopCart){
					$rootScope.load = true;
					var deferred = $q.defer();
					if($shopCart.shopCartData && $rootScope.id == $shopCart.shopCartData.id){
						$rootScope.load = false;
						deferred.resolve($shopCart.shopCartData);
						return deferred.promise;
						
					}else{
						$data.bulkRes($rootScope.id,function(data){
								deferred.resolve(data);
						})
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
					$data.authRes(function(data){
						if(!data){
							$data.preData={
								title:'参数错误',
								desc:'参数不存在'
							}
							$location.path("/error");
							return;
						}
						$rootScope.auth = data;
						if(!$rootScope.auth.user){
							$location.path('/bound_phone');
							return;
						}
						if(!$rootScope.orderId){
							$rootScope.orderId = $location.search().state;
						}
						$data.orderRequest($rootScope.orderId, function(data){
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
					});
					return deferred.promise;
				}]
			}
		})
		.when('/share', {
			templateUrl: 'html/share.html',
			controller: 'ShareController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.orderRequest($rootScope.orderId, function(data){
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
		.when('/orders', {
			templateUrl: 'html/orders.html',
			controller: 'OrdersController',
			resolve: {
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.authRes(function(data){
						if(!data){
							$data.preData={
								title:'参数错误',
								desc:'参数不存在'
							}
							$location.path("/error");
							return;
						}
						$rootScope.auth = data;
						if(!$rootScope.auth.user){
							$location.path('/bound_phone');
							return;
						}
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
					$data.orderRequest($rootScope.orderId, function(data){
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
				batch: ['$q', '$location', '$data', '$rootScope', function($q, $location, $data, $rootScope){
					$rootScope.load = true;
					var deferred = $q.defer();
					$data.historys($rootScope.productsId,function(data){
						$rootScope.load = false;
						deferred.resolve(data);
					},function(data,headers){
						deferred.reject(data);
					});
					return deferred.promise;
				}]
			}
		})
		//user module
		.when('/user_center', {
			templateUrl: 'html/user/user_center.html',
			controller: 'user_center_controller',
			resolve: {
				auth: ['$q', '$location', '$rootScope','authRes', function($q, $location,$rootScope,authRes){
						$rootScope.load = true;
						var code = $location.search().code;
						var deferred = $q.defer();
						if($rootScope.auth){
							deferred.resolve($rootScope.auth);
							return deferred.promise;
						}else{
							authRes.save({},{code:code},function(data){
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
		.when('/update_address', {
			templateUrl: 'html/user/update_address.html',
			controller: 'update_address_controller',
			resolve: {
				data: ['$q', 'address', function($q, address){
					var deferred = $q.defer();
					address.charge({},function(data){
						deferred.resolve(data);
					},function(data){
						deferred.resolve(data);
					});
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
		//appshare module
		.when('/recipes', {
			templateUrl: 'html/recipes.html',
			controller: 'recipesController'
		})
		.when('/dishs', {
			templateUrl: 'html/dishs.html',
			controller: 'dishsController'
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
		type: 'post',
		url: 'http://api.yijiayinong.com/v1/business/wxConfig',
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


module.exports = function(app){
	
	//user sign in root
	app.factory('authRes',function($resource){
		return $resource(appconfig+'business/weixin');
	});
	
	//checkout页详情
	/*app.factory('products',['$resource','$rootScope',function($resource, $rootScope){
		return $resource($rootScope.productsUrl,{batch:'@batch'},{
			'charge':{
				method:'get',
				isArray:false,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);*/
		
	//订单列表页	
	app.factory('orders',['$resource','$rootScope',function($resource, $rootScope){
		return $resource(appconfig+'business/orders/',{},{
			'charge':{
				method:'get',
				isArray:true,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);
	
	//地址列表页	
	app.factory('address',['$resource','$rootScope',function($resource, $rootScope){
		return $resource(appconfig+'business/shippingaddresses/',{},{
			'charge':{
				method:'get',
				isArray:true,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);
	
	//微信支付payRequest
	app.factory('payRequest',['$resource','$rootScope',function($resource, $rootScope){
		return $resource($rootScope.requestUrl,{},{
			'charge':{
				method:'get',
				isArray:false,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);
}

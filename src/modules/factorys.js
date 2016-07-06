module.exports = function(app){
	
	//user sign in root
	app.factory('authRes',function($resource){
		alert(5);
		return $resource('http://yijiayinong.com/api/business/weixin');
	});
	
	//checkout页详情
	app.factory('products',['$resource','$rootScope',function($resource, $rootScope){
		return $resource($rootScope.productsUrl,{batch:'@batch'},{
			'charge':{
				method:'get',
				isArray:false,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);

	//购买历史记录
	app.factory('historys',['$resource','$rootScope',function($resource, $rootScope){
		return $resource($rootScope.historys,{batch:'@batch'},{
			'charge':{
				method:'get',
				isArray:true,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);
		
	//订单列表页	
	app.factory('orders',['$resource','$rootScope',function($resource, $rootScope){
		return $resource('http://yijiayinong.com/api/business/orders/',{},{
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
		return $resource('http://yijiayinong.com/api/business/shippingaddresses/',{},{
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

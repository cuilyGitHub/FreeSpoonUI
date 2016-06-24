module.exports = function(app){
	
	app.factory('authRes',function($resource){
		return $resource('http://yijiayinong.com/api/business/weixin');
	});
	
	app.factory('bulksRes',['$resource', '$rootScope', function($resource, $rootScope){	
		return $resource('http://yijiayinong.com/api/business/bulks/?:search',{search:'@search'},{
			'charge':{
				method:'get',
				isArray:true,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
		
	}]);
	
	app.factory('bulkRes',['$resource','$rootScope',function($resource, $rootScope){
		return $resource('http://yijiayinong.com/api/business/bulks/:batch',{batch:'@batch'},{
			'charge':{
				method:'get',
				isArray:false,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);

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
	
	app.factory('order',['$resource','$rootScope',function($resource, $rootScope){
		return $resource($rootScope.ordersUrl,{batch:'@batch'},{
			'charge':{
				method:'get',
				isArray:false,
				headers:{
					'Authorization':'JWT '+ $rootScope.auth.token
				}
			}
		});
	}]);
	
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
	
	app.factory('payRequest',['$resource','$rootScope',function($resource, $rootScope){
		return $resource($rootScope.requestUrl,{balance:'@balance'},{
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

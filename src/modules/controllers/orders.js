module.exports = function(app){

	app.controller('OrdersController', function($scope, $routeParams, $data, $location, $http, $wxBridge, $rootScope, batch){
				
		if(!batch){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		
		$scope.orders = batch;
	
		$rootScope.title = '我的订单';
	
		$scope.openOrder = function(orderId){	
			if(batch.status<0){
				alert('生成订单失败');
				return;
			}
			$rootScope.orderId = orderId;
			$location.path("/order");
		}
		
		$scope.goPay = function(orderId){
			if(batch.status<0){
				alert('生成订单失败');
				return;
			}			
			$rootScope.orderId = orderId;
			$location.path("/payment");
		}
		
	});

}
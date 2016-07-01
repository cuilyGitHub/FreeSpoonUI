module.exports = function(app){

	app.controller('OrdersController', function($scope, $routeParams, $data, $history,$location, $http, $wxBridge, $rootScope, batch){
		
		if(!batch){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		
		$scope.orders = batch;
		
		
		 if($history.urlQueue.length>0){
				 $scope.icoStatus=false;
				 $scope.back=function(){
					 $location.path('/index');
				 };
		 }else{
			 $scope.icoStatus=true;
			 $scope.back=function(){
				 wx.closeWindow();
			 };
		 }
		
		
		$scope.openOrder = function(orderUrl){		
			$history.getHistory();
			$rootScope.orderUrl = orderUrl;
			//$rootScope.orderId = order.id;
			//$data.prePromptPay = promptPay;
			$location.path("/order");
		}
		
		$scope.goPay = function(orderUrl){		
			$history.getHistory();
			$rootScope.orderUrl = orderUrl;
			$location.path("/payment");
		}
		
	});

}
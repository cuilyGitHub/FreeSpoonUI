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
			if($history.urlQueue[0] == '/checkout'){
				$scope.icoStatus=false;
				$scope.back=function(){
					$location.path('/index');
				};
			}else{
				$scope.icoStatus=false;
					$scope.back=function(){
						$location.path($history.urlQueue[0]);
					};
			} 
		 }else{
			 $scope.icoStatus=true;
			 $scope.back=function(){
				 wx.closeWindow();
			 };
		 }
		
		
		$scope.openOrder = function(orderId){		
			//$history.getHistory();
			$rootScope.orderId = orderId;
			//$rootScope.orderId = order.id;
			//$data.prePromptPay = promptPay;
			$location.path("/order");
		}
		
		$scope.goPay = function(orderId){		
			//记录当前页面
			//$history.getHistory();
			$rootScope.orderId = orderId;
			$location.path("/payment");
		}
		
	});

}
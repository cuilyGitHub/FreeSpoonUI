module.exports = function(app){

	app.controller('OrdersController', function($scope, $routeParams, $data, $history,$location, $http, $wxBridge, orders){
		
		if(!orders){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		
		$scope.orders = orders;
		
		 if($history.urlQueue.length>0){
				 $scope.icoStatus=false;
				 $scope.back=function(){
					 $location.path('/');
				 };
		 }else{
			 $scope.icoStatus=true;
			 $scope.back=function(){
				 alert('关闭');
			 };
		 }
		
		
		$scope.openOrder = function(orderId, promptPay){
			$history.getHistory();
			$data.prePromptPay = promptPay;
			$location.path("/order/{orderId}".assign({orderId: orderId}));
		}
		
	});

}
module.exports = function(app){
	
	app.controller('PaymentController',['payRequest', '$rootScope', '$scope', '$data', '$location', '$history', 'batch', function(payRequest, $rootScope, $scope, $data, $location, $history, batch){
		if(!batch){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
		}
		if($data.ordersData ){
			var batch = $data.ordersData;
		}else{
			var batch = batch;
		}
		
		$scope.back=function(){
			if($history.urlQueue.length>0){
				$location.path($history.urlQueue[0]);
			}
		};
		
		$scope.data = batch;
		$scope.balance = $rootScope.auth.user.balance;
		
		$rootScope.orderUrl = batch.url;
		$rootScope.requestUrl = batch.wx_pay_request;
		
		$scope.payBalance=function(){
			if(!$scope.balance &&　$scope.balance == 0){
				return;
			}
				$scope.isSelected = !$scope.isSelected;
				$scope.isSuccess = !$scope.isSuccess;
				$rootScope.balance='1';
		}
		
		$scope.wx_Method=function(){
			$scope.isWx = !$scope.isWx;
			$rootScope.balance='0';
		}
	
		$scope.pay_wx = function(){
			if(!$scope.isSuccess && !$scope.isWx){
				alert('请选择支付方式');
				return;
			}else if($scope.isSuccess){
				$data.payRequest($rootScope.requestUrl, $rootScope.balance, function(data){
					if(data.require_third_party_payment){
						$data.wx_pay_request = data.pay_request_json;
						$data.prePromptPay = true;
					}
					$location.path('/share');
				});
			}else{
				$data.payRequest($rootScope.requestUrl, $rootScope.balance, function(data){
					$data.wx_pay_request = data.pay_request_json;
					$data.prePromptPay = true;
					$location.path('/order');
				});
			}

		}
		
	}]);

}
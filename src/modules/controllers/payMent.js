module.exports = function(app){
	
	app.controller('PaymentController',['payRequest', '$rootScope', '$scope', '$data', '$location', 'batch', function(payRequest, $rootScope, $scope, $data, $location, batch){
		
		if($data.ordersData ){
			var batch = $data.ordersData;
		}else{
			var batch = batch;
		}
		
		$rootScope.title = '在线支付';
		
		$scope.data = batch;
		$scope.balance = $rootScope.auth.user.balance;
		
		$rootScope.orderUrl = batch.url;
		$rootScope.requestUrl = batch.wx_pay_request;
		
		if($scope.balance){
			$scope.isSuccess = true;
			$scope.isSelected = true;
		}
		if(!$scope.balance){
			$scope.isWx = true;
		}
		
		$scope.payBalance=function(){
			if(!$scope.balance &&　$scope.balance == 0){
				return;
			}
			$scope.isSelected = !$scope.isSelected;
		}
		
		$scope.wx_Method=function(){
			$scope.isWx = !$scope.isWx;
		}
	
		$scope.pay_wx = function(){
			console.log($rootScope.balance);
			if(!$scope.isSelected && !$scope.isWx){
				alert('请选择支付方式');
				return;
			}else if($scope.isSelected){
				$data.payRequest($rootScope.requestUrl, $rootScope.balance, function(data){
					if(data.require_third_party_payment){
						$data.wx_pay_request = data.pay_request_json;	
						$data.prePromptPay = true;
						$rootScope.payment = '微信支付';
						$location.path('/order');
						return;
					}
					$rootScope.payment = '零钱支付';
					$rootScope.share = false;
					$location.path('/share');
				});
			}else{
				$rootScope.balance='0';
				$data.payRequest($rootScope.requestUrl, $rootScope.balance, function(data){
					$data.wx_pay_request = data.pay_request_json;
					$data.prePromptPay = true;
					$rootScope.payment = '微信支付';
					$location.path('/order');
				});
			}

		}
		
	}]);

}
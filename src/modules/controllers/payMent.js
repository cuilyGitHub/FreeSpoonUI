module.exports = function(app){
	
	app.controller('PaymentController',function($rootScope, $scope, $data, $location, batch){
	
	$data.refresh($rootScope.auth.token,function(data){
		$rootScope.auth = data;
		$scope.balance = $rootScope.auth.user.balance;
		if($scope.balance){
			$scope.isSuccess = true;
			$scope.isSelected = true;
		}
		if(!$scope.balance){
			$scope.isWx = true;
			$scope.isSelected = false;
			return;
		}
		if($scope.balance && $scope.balance < batch.total_fee){
			$scope.isSelected = true;
			$scope.isWx = true;
			return;
		}
	})
		
		$rootScope.title = '在线支付';
		$scope.data = batch;
		
		$rootScope.orderUrl = batch.url;
		$rootScope.requestUrl = batch.wx_pay_request;
		
		
		
		$scope.payBalance=function(){
			if(!$scope.balance &&　$scope.balance == 0){
				return;
			}
			if($scope.balance < batch.total_fee){
				$scope.isSelected = !$scope.isSelected;
				return;
			}
			$scope.isWx = false;
			$scope.isSelected = true;
		}
		
		$scope.wx_Method=function(){
			if(!$scope.balance && $scope.balance == 0){
				return;
			}
			if($scope.balance < batch.total_fee){
				return;
			}
			//$scope.isWx = !$scope.isWx;
			$scope.isWx = true;
			$scope.isSelected = false;
		}
	
		$scope.pay_wx = function(){
			if($scope.isSelected){
				$rootScope.balance = '1';
				$data.payRequest($rootScope.requestUrl, $rootScope.balance, function(data){
					if(data.errcode == -2){
						$scope.isShow = true;
						var name = [];
						for(var i=0;i<data.detail.length;i++){
							name.push(data.detail[i].product_title);
						}
						$scope.name = name.join('、')
						return;
					}
					if(data.require_third_party_payment){
						$data.wx_pay_request = data.pay_request_json;	
						$data.prePromptPay = true;
						$rootScope.payment = '微信支付';
						$location.path('/order');
						return;
					}
					$rootScope.payment = '余额支付';
					$rootScope.share = false;
					$location.path('/share');
				});
			}else{
				$rootScope.balance='0';
				$data.payRequest($rootScope.requestUrl, $rootScope.balance, function(data){
					if(data.errcode == -2){
						$scope.isShow = true;
						var name = [];
						for(var i=0;i<data.detail.length;i++){
							name.push(data.detail[i].product_title);
						}
						$scope.name = name.join('、')
						return;
					}
					$data.wx_pay_request = data.pay_request_json;
					$data.prePromptPay = true;
					$rootScope.payment = '微信支付';
					$location.path('/order');
				});
			}
		}
		
		$scope.close_popup = function(){
			$scope.isShow = false;
		}
		
	});

}
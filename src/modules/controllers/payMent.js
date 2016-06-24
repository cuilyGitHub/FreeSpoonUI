module.exports = function(app){
	
	app.controller('PaymentController',['$q', '$scope', '$data', '$location', '$rootScope', 'payRequest', function($q, $scope, $data, $location, $rootScope, payRequest){
		if(!$data.ordersData){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
		}
		var batch = $data.ordersData;
		$scope.data = batch;
		$scope.balance = $rootScope.auth.user.balance;
		$rootScope.ordersUrl = batch.url;
		$rootScope.requestUrl = batch.wx_pay_payRequest;
		(function(){
			var sum=0;
			$scope.payBalance=function(){
				if(!$scope.balance &&　$scope.balance == 0){
					return;
				}
				sum++;
				if(sum%2==0){
					$scope.isSelected = false;
					$scope.isSuccess = false;
				}else{
					$scope.isSelected = true;
					$scope.isSuccess = true;
				}
			}
		})();
		
		(function(){
			var sum=0;
			$scope.wx_Method=function(){
				$data.payMethod = 'wx';
				sum++;
				if(sum%2==0){
					$scope.isWx = true;
				}else{
					$scope.isWx = false;
				}
			}
		})();
	
		$scope.pay_wx = function(requestUrl){
			if($data.payMethod || $data.payMethod == 'wx'){
				var balance='balance=1'
				var deferred = $q.defer();
					payRequest.charge({},function(data){
						deferred.resolve(data);
					},function(data,headers){
						deferred.reject(data);
					});
				return deferred.promise;
			}else{
				$data.payRequest(function(balance){
					$data.requestData = data;
				})
			}
			
			
			$data.prePromptPay = true;
			$location.path('/order');
			
		}
		
		$scope.back=function(){
			$location.path("/checkout");
		}
	}]);

}
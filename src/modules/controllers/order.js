module.exports = function(app){

		app.controller('OrderController', function($scope, $location, $data, $history, $wxBridge, $route, batch, $rootScope){
		
			if(!batch || !$data.payRequest){
				$data.preData={
					title:'参数错误',
					desc:'参数不存在'
				}
				$location.path("/error");
				return;
			}

			$scope.order = batch;
			$scope.dispatcher = batch.dispatcher;
			
			/*if($history.urlQueue.length>0){
				$scope.icoStatus=false;
				$scope.back=function(){
					//$history.urlQueue.length = 0;
					$location.path('/orders');
				};
			}else{
				$scope.icoStatus=true;
				$scope.back=function(){
					alert('关闭');
				};
			}*/
			
			$scope.back=function(){
					$location.path('/orders');
				};
			
			
			$scope.pay = function(){
				$wxBridge.pay($data.wx_pay_request, function(){
					$scope.$apply(function(){
						$location.path("/share");
					});
					$route.reload();
				});
			}
			
			$scope.goShare = function(){
				$location.path("/share");
			};
			
			if($data.prePromptPay){
				$scope.pay();
			}
			$data.prePromptPay = false;
			
			$scope.orderConfirm=function(){
				var r=confirm('是否取消订单');
				if(r==true){
					$data.orderDel($rootScope.orderUrl,function(){
						alert('订单取消成功');
						$location.path("/orders");
					});
				}else{
					alert('订单取消失败');
				}
			}
			
	});

}
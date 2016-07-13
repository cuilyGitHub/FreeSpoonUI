module.exports = function(app){

		app.controller('OrderController', function($scope, $location, $data, $wxBridge, $route, batch, $rootScope){
		
			if(!batch || !$data.payRequest){
				$data.preData={
					title:'参数错误',
					desc:'参数不存在'
				}
				$location.path("/error");
				return;
			}
			
			$rootScope.title = '订单详情';
			
			$scope.payment = $rootScope.payment;
			$scope.order = batch;
			$scope.dispatcher = batch.dispatcher;
			
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
			
			$scope.payment = function(){
				$location.path("/payment");
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
					$data.orderDel($rootScope.orderId,function(){
						alert('订单取消成功');
						$location.path("/orders");
					});
				}else{
					alert('订单取消失败');
				}
			}
			
	});

}
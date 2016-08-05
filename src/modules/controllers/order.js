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
			
			$scope.paymentText = $rootScope.payment;
			$scope.order = batch;
			$scope.dispatcher = batch.dispatcher;
			
			if(!batch.payrequest || !batch.payrequest.use_balance == 1){
				$scope.balance =0;			
			}else{
				$scope.balance = batch.payrequest.balance_fee;
			}
		
			$scope.pay = function(){
				$wxBridge.pay($data.wx_pay_request, function(){
					$scope.$apply(function(){
						$location.path("/share");
					});
					$route.reload();
				});
			}
			
			$scope.payment = function(){
				if(batch.status == -1){
					alert('团购已过期');
					return;
				}
				$location.path("/payment");
			}
			
			$scope.goShare = function(){
				if(batch.bulk_status<0){
					alert('团购已过期');
					return;
				}
				$rootScope.share = true;
				$location.path("/share");
			};
			
			if($data.prePromptPay){
				$rootScope.share = false;
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
			
			$scope.del = function(){
				var d=confirm('是否删除订单');
				if(d==true){
					$data.orderDel($rootScope.orderId,function(){
						alert('删除订单成功');
						$location.path("/orders");
					});
				}else{
					alert('删除订单失败');
				}
			}
			
	});

}
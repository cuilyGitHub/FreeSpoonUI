module.exports = function(app){

		app.controller('OrderController', function($scope, $location, $data, $wxBridge, $route, batch, $rootScope){
		
			if(!$data.payRequest){
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
			$scope.storage = batch.storage;
			
			if(batch.receive_mode == 1){
				$scope.receive_mode = "自提点自提";
			}else if(batch.receive_mode == 2){
				$scope.receive_mode = "送货上门";
			}
			
			(function(){
				if(!batch.payrequest){
					$scope.balance =0;
					$scope.paymentText = '未支付';
					return;
				}
				if(batch.payrequest.use_balance == 0){
					$scope.balance =0;
					$scope.paymentText = '微信支付';
					return;
				}
				if(batch.payrequest.use_balance == 1 && batch.payrequest.third_party_fee==0){
					$scope.balance = batch.payrequest.balance_fee;
					$scope.paymentText = '余额支付';
					return;
				}
				if(batch.payrequest.use_balance == 1 && batch.payrequest.third_party_fee>0){
					$scope.balance = batch.payrequest.balance_fee;
					$scope.paymentText = '微信支付';
					return;
				}
			})();
			
			if(batch.status == 0){
				$scope.balance = '0';
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
module.exports = function(app){

		app.controller('OrderController', function($scope, $location, $data, $history, $wxBridge, batch){
		
			/*if(!orderInfo || !orderInfo.data || !orderInfo.payRequest){
				$data.preData={
					title:'参数错误',
					desc:'参数不存在'
				}
				$location.path("/error");
				return;
			}*/

			$scope.order = batch;
			$scope.dispatcher = batch.dispatcher;
			
			if($history.urlQueue.length>0){
				$scope.icoStatus=false;
				$scope.back=function(){
					$location.path('/orders');
				};
			}else{
				$scope.icoStatus=true;
				$scope.back=function(){
					alert('关闭');
				};
			}
			
			$scope.pay = function(){
				$wxBridge.pay(orderInfo.payRequest, function(){
					$scope.$apply(function(){
						$location.path("/share/{orderId}".assign({orderId: orderInfo.data.id}));
					});
				});
			}
			if($data.prePromptPay){
				$scope.pay();
			}
			$data.prePromptPay = false;
			
			$scope.orderConfirm=function(){
				var r=confirm('是否取消订单');
				if(r==true){
					alert('订单取消成功');
					$data.undo(orderInfo.data.id, function(result){
						if(result){
							$location.path("/orders");
							return;
						} else {
							alert('取消订单失败');
						}
					});
				}else{
					alert('订单取消失败');
				}
			}
			
			$scope.undo = function(){
				$data.undo(orderInfo.data.id, function(result){
					if(result){
						$location.path("/orders");
						return;
					} else {
						alert('取消订单失败');
					}
				});
			}
			
	});

}
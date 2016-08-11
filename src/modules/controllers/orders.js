module.exports = function(app){

	app.controller('OrdersController', function($scope, $route, $data, $location, $rootScope, batch){
				
		if(!batch){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		
		$scope.orders = batch;
	
		$rootScope.title = '我的订单';
		
		$scope.orderConfirm=function(orderId){
				var r=confirm('是否取消订单');
				if(r==true){
					$data.orderDel(orderId,function(){
						alert('订单取消成功');
						 $route.reload();
					});
				}else{
					alert('订单取消失败');
				}
			}
			
		$scope.del = function(orderId){
			var d=confirm('是否删除订单');
			if(d==true){
				$data.orderDel(orderId,function(){
					alert('删除订单成功');
					 $route.reload();
				});
			}else{
				alert('删除订单失败');
			}
		}
		
		$scope.openOrder = function(orderId,index){
			if(batch[index].status<0){
				alert('订单已过期');
				return;
			}
			$rootScope.orderId = orderId;
			$location.path("/order");
		}
		
		$scope.openShare = function(orderId,index){	
			if(batch[index].status<0){
				alert('订单已过期');
				return;
			}
			$rootScope.orderId = orderId;
			$rootScope.share = true;
			$location.path("/share");
		}
		
		$scope.goPay = function(orderId,status){
			if(status == -1){
				alert('订单已过期');
				return;
			}			
			$rootScope.orderId = orderId;
			$location.path("/payment");
		}
		
	});

}
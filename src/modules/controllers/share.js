module.exports = function(app){

	app.controller('ShareController', function($scope, $location, $data, $wxBridge, orderId){
		
		$data.requestOrderAmount(orderId, function(orderAmount){
			if(!orderAmount){
				orderAmount = 'X';
			}
			$scope.orderAmount = orderAmount;
			$data.getWXShareInfo($data.lastBatchid, function(shareInfo){
				shareInfo.title=shareInfo.title+'(我是第'+$scope.orderAmount+'位接龙者)';
				$wxBridge.configShare(shareInfo);
			});
		});
		
		$scope.jump = function(){
			$location.path("/order/{orderId}".assign({orderId: orderId}));
		}
		
	});

}
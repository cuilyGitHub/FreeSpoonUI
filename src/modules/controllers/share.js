module.exports = function(app){

	app.controller('ShareController', function($scope, $location, $data, $wxBridge, $rootScope, batch){
		
		/*$data.orderRequest($rootScope.orderUrl, function(data){
			if(!data){
				$data.preData={
					title:'参数错误',
					desc:'参数不存在'
				}
				$location.path("/error");
				return;
			}
			return data;
		});*/
		$scope.seq = batch.seq;
		
		$scope.jump = function(){
			$location.path("/order");
			$data.prePromptPay = false;
		}
		
	});

}
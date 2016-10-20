module.exports = function(app){

	app.controller('ShareController', function($scope, $location, $data, $wxBridge, $rootScope, batch){

		//配置微信分享
		$wxBridge.configShare(batch);
		
		$scope.isHide = $rootScope.share;
		
		$scope.seq = batch.seq;
		
		$scope.jump = function(){
			$location.path("/order");
			$data.prePromptPay = false;
		}
		
		$scope.close = function(){
			$wxBridge.closeWindow();
		}
		
	});

}
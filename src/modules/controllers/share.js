module.exports = function(app){

	app.controller('ShareController', function($scope, $location, $data, $wxBridge, $rootScope, batch){
		
		//配置微信分享
		var shareInfo = {
			card_title:batch.card_title,
			card_desc:'我是第'+batch.seq+'位接龙者，大家快来参团吧!',
			card_url:batch.card_url, 
			card_icon:batch.card_icon
		};
		$wxBridge.configShare(shareInfo);
		
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
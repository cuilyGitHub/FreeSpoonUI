module.exports = function(app){

	app.controller('ShareController', function($scope, $location, $data, $wxBridge, $rootScope, batch){
		
		wx.onMenuShareAppMessage({
			title: batch.card_title, 
			desc: '我是第'+batch.seq+'位接龙者，大家快来参团吧!', 
			link: batch.card_url, 
			imgUrl: batch.card_icon,
				//type: '', 
				//dataUrl: '', 
			success: function () {
				//TODO
			},
			cancel: function () {
				//TODO
			}
		});
		
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
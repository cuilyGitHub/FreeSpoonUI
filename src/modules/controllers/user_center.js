module.exports = function(app){

	app.controller('user_center_controller', function($scope, $location, $rootScope, $history, auth){

		if(!auth){
			$location.path("/error");
			return;
		}		
		// import data
		$rootScope.auth = auth;
		if(!$rootScope.auth){
			$location.path('/error') ;
			return;
		}
			
		//import data
		if($rootScope.auth){
			$scope.data = $rootScope.auth;
		}
		
		wx.onMenuShareAppMessage({
			title: '我是标题', 
			desc: '我是描述', 
			link: 'http://yijiayinong.com/api/business/redirect?state=', 
			imgUrl: 'http://yijiayinong.com/media/images/product/2016/06/22/2_rHFaGMq.jpg',
				//type: '', 
				//dataUrl: '', 
			success: function () {
				//TODO
			},
			cancel: function () {
				//TODO
			}
		});
		
		$scope.address = function(){;
			if(!$rootScope.auth.user){
				$location.path("/bound_phone");
				return;
			}
			$location.path("/update_address");
		}
		
		$scope.phone = function(){
			$history.getHistory();
			$location.path("/bound_phone");
		}
		
		$scope.orders = function(){
			//记录当前页面
			$history.getHistory();			
			if(!$rootScope.auth.user){
				$location.path("/bound_phone");
				return;
			}
			$location.path("/orders");
		}
		
	});

}
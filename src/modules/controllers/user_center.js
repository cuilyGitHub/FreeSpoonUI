module.exports = function(app){

	app.controller('user_center_controller', function($scope, $location, $rootScope, auth){

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
		
		$rootScope.title = '个人中心';
			
		//import data
		if($rootScope.auth){
			$scope.data = $rootScope.auth;
		}
		
		wx.onMenuShareAppMessage({
			title: '一家一农', 
			desc: '每周团购深海野生海鲜，新鲜水果，种类齐全，品质至上', 
			link: 'http://dev.yijiayinong.com/api/business/redirect?state=', 
			imgUrl: 'http://dev.yijiayinong.com/assets/images/logo.png',
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
			$location.path("/bound_phone");
		}
		
		$scope.orders = function(){		
			if(!$rootScope.auth.user){
				$location.path("/bound_phone");
				return;
			}
			$location.path("/orders");
		}
		
	});

}

module.exports = function(app){

	app.controller('user_center_controller', function($scope, $location, $rootScope, $history, auth){
		alert('22222'); 


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

		/*alert('user_controlller');
		$location.path('/update_address');
		alert('user_controlller_1111');
		return;*/
			
		//import data
		if($rootScope.auth){
			$scope.data = $rootScope.auth;
		}
		
		
		
		$scope.address = function(){
			alert(1);
			alert(JSON.stringify($rootScope.auth));
			if(!$rootScope.auth.user){
				$location.path("/bound_phone");
				return;
			}
			$location.path("/update_address");
			alert(JSON.stringify($rootScope.auth.user));
		}
		
		$scope.phone = function(){
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
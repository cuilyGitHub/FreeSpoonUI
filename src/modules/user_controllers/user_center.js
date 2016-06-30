module.exports = function(app){

	app.controller('user_center_controller', function($scope, $location, $rootScope){
			
		//import data
		
		$scope.address = function(){
			$location.path("/update_address");
			if(!$rootScope.auth.user){
				$location.path("/bound_phone");
				return;
			}
		}
		
		$scope.phone = function(){
			$location.path("/bound_phone");
		}
		
		$scope.orders = function(){
			$location.path("/orders");
			if(!$rootScope.auth.user){
				$location.path("/bound_phone");
				return;
			}
		}
		
	});

}
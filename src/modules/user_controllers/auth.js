module.exports = function(app){

	app.controller('auth_controller', function($scope, $rootScope, $location, auth){
		if(!auth){
			$location.path("/error");
			return;
		}		
		// import data
		$rootScope.auth = auth;
		if(!$rootScope.auth){
			$location.path('/error') ;
			return;
		}else{
			$location.path('/user_center') ;
		}
	});

}
module.exports = function(app){

	app.controller('AuthController', function($route,$scope, $data, $location, $history, auth, $rootScope){
		if(!auth){
			$location.path("/error");
			return;
		}
			
		// import data
		$rootScope.auth = auth;
		if(auth.length != 0){
			$location.path('/freeIndex') ;
		}
	});

}
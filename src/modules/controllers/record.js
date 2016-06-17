module.exports = function(app){

	app.controller('RecordController', function($scope, $data, $location, batch){
		
		if(!batch){
			$location.path("/error");
			return;
		}
		
		$scope.batch = batch;
		
		$scope.back=function(){
			$location.path("/index");
		};
	});

}
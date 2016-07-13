module.exports = function(app){

	app.controller('RecordController', function($scope, $data, $location, $rootScope, batch){
		
		if(!batch){
			$location.path("/error");
			return;
		}
		
		$rootScope.title = '成交记录';
		$scope.batch = batch;
		
		$scope.back=function(){
			$location.path("/index");
		};
	});

}
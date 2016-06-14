module.exports = function(app){

	app.controller('RecordController', function($scope, $data, $location){
		$scope.back=function(){
			$location.path("/");
		};
	});

}
module.exports = function(app){

	app.controller('GoodsDetailsController', function($scope, $data, $location){
		$scope.back=function(){
			$location.path("/index");
		};
	});

}
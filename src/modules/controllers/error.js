module.exports = function(app){

	app.controller('ErrorController', function($scope,$data){
		
		if(!$data.preData){
			$scope.title = '错误',
			$scope.desc = '未知错误'
			return;
		}
		$scope.title = $data.preData.title;
		$scope.desc = $data.preData.desc;
		
		$data.preData = null;
	});

}
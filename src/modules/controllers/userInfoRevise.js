module.exports = function(app){

	app.controller('userInfoRevise_controller', function($scope, $location, $rootScope, data){
		
		$rootScope.title = '修改收货人';
		
		//用户信息处理
		if(!$rootScope.Consignee && !$rootScope.userPhone){
			$scope.mob = data.recent_obtain_mob;
			$scope.name = data.recent_obtain_name;
		}else{
			$scope.name = $rootScope.Consignee;
			$scope.mob = $rootScope.userPhone;
		}
		
		//保存用户修改信息
		$scope.keepInfo = function(){
			if(!$scope.mob || !$scope.name){
				return;
			}
			$rootScope.Consignee = $scope.name;
			$rootScope.userPhone = $scope.mob;
			$location.path('/distribution');
		}
		
	});

}
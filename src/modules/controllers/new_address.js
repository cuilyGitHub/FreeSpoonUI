module.exports = function(app){

	app.controller('new_address_controller', function($scope, $location, $rootScope, $data){
		
		$rootScope.title = '添加地址';

		$scope.name = '';
		$scope.mob = '';
		$scope.address = '';
				
		$scope.post_info = function(){
					
			if(!$scope.name){
				alert('请填写姓名');
				return;
			}
			if(!$scope.mob){
				alert('请填写电话');
				return;
			}
			if($scope.mob.length != 11){
				alert('请填写正确的电话号码');
				return;
			}
			if(!$scope.address){
				alert('请填写地址');
				return;
			}
			
			var address_info = {};
			address_info.name = $scope.name;
			address_info.mob = $scope.mob;
			address_info.address = $scope.address;
			$data.add_address(address_info,function(data){
				if(!data){
					alert('地址添加失败');
					return;
				}
				$location.path('update_address');
			});
		}
		
	});

}
module.exports = function(app){

	app.controller('del_address_controller', function($scope, $location, $data, $rootScope, data){
		
		if(!data){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		if(!$rootScope.fromCheckout){
			$scope.isShow = true;
		}
		
		$rootScope.title = '修改地址';
		
		if(data.name){
			$scope.name = data.name;
		}
		if(data.mob){
			$scope.mob = data.mob;
		}
		if(data.address){
			$scope.address = data.address;
		}
		
		$scope.del = function(){
			
			var r=confirm('是否删除地址');
				if(r==true){
					$data.del_address($data.address_id,function(data){
						alert('地址删除成功');
						$location.path('/update_address');
					});
				}else{
					alert('地址删除失败');
			}
		}
		
		$scope.post_info = function(){
			
			if(!$scope.name){
				alert('请填写姓名');
				return;
			}
			if(!$scope.mob){
				alert('请填写电话');
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
			$data.put_address($data.address_id,address_info,function(data){
				if(!data){
					alert('地址修改失败');
					return;
				}
				$location.path('update_address');
			});
		}
		
	});

}
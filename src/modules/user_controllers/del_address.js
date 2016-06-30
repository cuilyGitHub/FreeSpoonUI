module.exports = function(app){

	app.controller('del_address_controller', function($scope, $location, $data, data){
		
		if(!data){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		
		if(data.name){
			$('.__name')[0].value = data.name;
		}
		if(data.mob){
			$('.__tel')[0].value = data.mob;
		}
		if(data.address){
			$('.__address')[0].value = data.address;
		}
		
		$scope.back = function(){
			$location.path("/update_address");
		}
		
		$scope.del = function(){
			$data.del_address($data.address_id,function(data){
				alert('地址删除成功');
				$location.path('/update_address');
			});
		}
		
		
		
	});

}
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
		
		$scope.post_info = function(){
			var name = $('.__name')[0].value;
			var tel = $('.__tel')[0].value;
			var address = $('.__address')[0].value;
			
			if(!name){
				alert('请填写姓名');
				return;
			}
			if(!tel){
				alert('请填写电话');
				return;
			}
			if(!address){
				alert('请填写地址');
				return;
			}
			
			var address_info = {};
			address_info.name = name;
			address_info.mob = tel;
			address_info.address = address;
			console.log(address_info);
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
module.exports = function(app){

	app.controller('new_address_controller', function($scope, $location, $rootScope, $data){
		
		$rootScope.title = '添加地址';
				
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
			if(tel.length != 11){
				alert('请填写正确的电话号码');
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
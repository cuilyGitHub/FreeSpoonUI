module.exports = function(app){

	app.controller('bound_phone_controller', function($scope, $location, $data, $rootScope){
			
		$scope.back = function(){
			$location.path("/user_center");
		}
		
		$scope.delCode = function(){
			$(".__code")[0].value = '';
		}
		
		$scope.getCode=function(){
			$scope.mob = $(".__mob")[0].value;
			if(!$scope.mob){
				alert('请填写手机号');
				return;
			}
			$data.mobCode_Request($scope.mob,function(){
				alert('验证码已发送至您的手机！');
			});
		}
		
		$scope.postMob=function(){	
			$scope.mob = $(".__mob")[0].value;
			$scope.code = $(".__code")[0].value;
			if(!$scope.mob){
				alert('请填写手机号');
				return;
			}
			if(!$scope.code){
				alert('请填写验证码');
				return;
			}
			$data.bindMob($scope.mob,$scope.code,function(data){
				if(!data){
					alert('用户注册失败');
					return;
				}else{
					$rootScope.auth = data;
					$location.path("/user_center");
				}
			});
		}
		
	});

}
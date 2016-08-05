module.exports = function(app){

	app.controller('bound_phone_controller', function($scope, $location, $data, $rootScope, $interval){
		
		$rootScope.title = '绑定手机';
		$scope.mob = '';
		$scope.code = '';
		//phone message code
		$scope.paracont = '获取验证码';
		$scope.paraevent = false;
		
			
		
		
		$scope.delCode = function(){
			$scope.code = '';
		}
		
		$scope.getCode=function(){
			var second = 60;
			var	timePromise = undefined;
			if(!$scope.mob){
				alert('请填写手机号');
				return;
			}
			if($scope.paraevent){
				return;
			}
			$data.mobCode_Request($scope.mob,function(){
				timePromise = $interval(function(){
					if(second<=0){
						$interval.cancel(timePromise);
						timePromise = undefined;
						
						second = 60;
						$scope.paracont = "获取验证码";
						$scope.paraclass = false;
						$scope.paraevent = false;
					}else{
						$scope.paracont = second + "s后重试";  
						$scope.paraclass = true;
						$scope.paraevent = true;  
						second--;  
					}
				},1000,100);
			});

		}
		
		$scope.postMob=function(){	
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
				}else if($scope.icoStatus){
					$rootScope.auth = data;
					$location.path("/orders");
				}else{
					$rootScope.auth = data;
					$location.path("/user_center");
				}
			});
		}
		
	});

}
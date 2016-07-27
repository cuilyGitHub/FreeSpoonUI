module.exports = function(app){

	app.controller('dishsController', function($route, $http, $scope, $location, $data, $wxBridge, $rootScope){
		
		function getDdata(){
			$http({
					method:'get',
					url:'http://api.yijiayinong.com/api/business/dishs/'+dishsId,
					headers:{'Authorization':'JWT '+ $rootScope.auth.token}
				})
			.success(function(data){
				if(!data){
					return;
				}
				console.log(data);
				$scope.cooks=data;
			});
		}
		
		if($data.dishsId){
			dishsId = $data.dishsId;
		}else{
			var id=$location.search();
			if(!id){
				alert('id不存在');
				return;
			}
			dishsId = id.state;
		}
		
		
		$data.authRes(function(data){
			if(!data){
				$data.preData={
					title:'参数错误',
					desc:'参数不存在'
				}
				$location.path("/error");
				return;
			}
			$rootScope.auth = data;
			getDdata();
		})
		
		$scope.jump=function(data){
			if(!data){
				return;
			}
			$data.dishsId = data;
			alert(data);
			$route.reload();
		}
		
	});

}

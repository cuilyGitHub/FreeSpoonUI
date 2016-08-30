module.exports = function(app){

	app.controller('update_address_controller', function($scope, $location, $data, $rootScope, data){

		$scope.data = data;
		
		$rootScope.title = '收货地址';
			
		$scope.back = function(){
			$location.path("/user_center");
		}
		
		$scope.add_address = function(){
			$location.path("/new_address");
		}
		
		$scope.revise_address = function(address_id){
			$data.address_id = address_id;
			$location.path("/del_address");
		}
		
		$scope.jumpCheckout = function(id){
			if(!$rootScope.fromCheckout){
				return;
			}
			$rootScope.userAddressInfo = data[id];
			$location.path("/checkout").replace();
		}
	});
}
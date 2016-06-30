module.exports = function(app){

	app.controller('update_address_controller', function($scope, $location, $data, data){
		
		$scope.data = data;
			
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
	});

}
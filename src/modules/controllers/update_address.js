module.exports = function(app){

	app.controller('update_address_controller', function($scope, $location, $data, data){
		
		alert('update');

		$scope.data = data;
			
		$scope.back = function(){
			alert('back');
			$location.path("/user_center");
		}
		$scope.add_address = function(){
			alert('add');
			$location.path("/new_address");
		}
		$scope.revise_address = function(address_id){
			alert('revise');
			$data.address_id = address_id;
			$location.path("/del_address");
		}
	});
}
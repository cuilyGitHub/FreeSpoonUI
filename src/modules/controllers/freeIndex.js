module.exports = function(app){

	app.controller('FreeIndexController', function($scope, $data, $location, freeIndex_Bacth){
		
		console.log(freeIndex_Bacth);
			
		if(!freeIndex_Bacth){
			$location.path("/error");
			return;
		}
			
		// import data
		$scope.batch = freeIndex_Bacth;
		
		$scope.jump = function(url){
			$location.path('/index');
		}

		setTimeout(function(){
			alert(111);
			jQuery(document).ready(function($) {
				$('.Carousel').unslider({
					autoplay: true,
					dots: false,
					arrows: false,
				});
			});
		}, 0);
		
			
	});
}
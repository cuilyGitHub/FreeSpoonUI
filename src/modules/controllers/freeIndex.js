module.exports = function(app){

	app.controller('FreeIndexController', function($scope, $data, $location){
			
			jQuery(document).ready(function($) {
				$('.a').unslider({
					autoplay: true,
					dots: false,
					arrows: false,
				});
			});
			
		});

}
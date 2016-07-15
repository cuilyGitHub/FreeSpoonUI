module.exports = function(app){

	app.controller('FreeIndexController', function($route,$scope, $data, $location, batch, $rootScope){
			
		if(!batch){
			$location.path("/error");
			return;
		}
		$scope.searchBox = false;
		$scope.box = true;
		$scope.content = false;
		
		$rootScope.title = '一家一农';
		
		//配置微信分享
		wx.onMenuShareAppMessage({
			title: '一家一农', 
			desc: '每周团购深海野生海鲜，新鲜水果，种类齐全，品质至上', 
			link: 'http://yijiayinong.com/api/business/redirect?state=', 
			imgUrl: 'http://yijiayinong.com/assets/images/logo.png',
				//type: '', 
				//dataUrl: '', 
			success: function () {
				//TODO
			},
			cancel: function () {
				//TODO
			}
		});
			
		// import data
		$scope.batch = batch;
		
		if(batch.length == 0){
			$scope.searchBox = true;
			$scope.content = true;
		}
		
		$scope.jump = function(data){
			
			$rootScope.id = data.id;
			if(data.status<0){
				return;
			}
			$location.path("/index") ;
		}
		
		$scope.cancel = function(){
			$rootScope.search = null;
			$location.path("/freeIndex");
			$route.reload();
		}
		
		$scope.focus = function(){
			var val = $('#cicle')[0].value;
			if(val){
				$('#cicle')[0].value='';
			}
			$scope.searchBox = true;
			$scope.box = false;
			$('.cicle').css('width','75%');
		}
		
		$scope.blur = function(){
			var val = $('#cicle')[0].value;
			if(!val){
				$('#cicle')[0].value = '搜索团主、商品';
				return;
			}
			$('#cicle')[0].value = val;
		}
		
		$scope.onkeydown = function(e){
			var keycode = window.event?e.keyCode:e.which;
			if(keycode == 13){
				$rootScope.search = 'search=' + $('#cicle')[0].value;
				$location.path('/freeIndex');
				$route.reload();
			}
		}
		
		$scope.more = function(){
			console.log('look more');
		}

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
          //下面是在ng-repeat render完成后执行的js
          $('.Carousel').unslider({
				//animation: 2,
				autoplay: true,
				dots: false,
				arrows: false,
			});
		});
		
	});
	
	app.directive('onFinishRenderFilters', function ($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if (scope.$last === true) {
					$timeout(function() {
						scope.$emit('ngRepeatFinished');
					});
				}
			}
		};
	});



}
module.exports = function(app){

	app.controller('FreeIndexController', function($route,$scope, $data, $location, $history, batch, $rootScope){
		$scope.searchBox = false;
		$scope.box = true;
		$scope.content = false;
			
		if(!batch){
			$location.path("/error");
			return;
		}
		
		//配置微信分享
		wx.onMenuShareAppMessage({
			title: '我是标题', 
			desc: '我是描述', 
			link: 'http://yijiayinong.com/api/business/redirect?state=', 
			imgUrl: 'http://yijiayinong.com/media/images/product/2016/06/22/2_rHFaGMq.jpg',
				//type: '', 
				//dataUrl: '', 
			success: function () {
				//TODO
			},
			cancel: function () {
				//TODO
			}
		});
			
		if($history.urlQueue.length>0){
				 $scope.icoStatus=false;
				 $scope.back=function(){
					 $location.path('/index');
				 };
		 }else{
			 $scope.icoStatus=true;
			 $scope.back=function(){
				 wx.closeWindow();
			 };
		 }	
			
		// import data
		$scope.batch = batch;
		
		if(batch.length == 0){
			$scope.searchBox = true;
			$scope.content = true;
		}
		
		$scope.jump = function(stateId){
			$rootScope.id = stateId;
			$location.path("/index") ;
		}
		
		$scope.focus = function(){
			var val = $('#cicle')[0].value;
			if(val == '搜索团主、商品'){
				$('#cicle')[0].value='';
			}
			$scope.searchBox = true;
			$scope.box = false;
		}
		
		$scope.blur = function(){
			var val = $('#cicle')[0].value;
			if(!val){
				$('#cicle')[0].value = '搜索团主、商品';
				$scope.box = true;
			}
		}
		
		$scope.onkeydown = function(e){
			var keycode = window.event?e.keyCode:e.which;
			if(keycode == 13){
				$rootScope.search = 'search=' + $('#cicle')[0].value;
				$location.path('/freeIndex');
				$route.reload();
			}
		}

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
          //下面是在ng-repeat render完成后执行的js
          $('.Carousel').unslider({
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
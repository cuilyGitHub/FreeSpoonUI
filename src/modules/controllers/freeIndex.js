module.exports = function(app){

	app.controller('FreeIndexController', function($route,$scope, $data, $location, batch, $rootScope,$wxBridge){
			
		if(!batch){
			$location.path("/error");
			return;
		}
		$scope.searchBox = false;
		$scope.box = true;
		$scope.content = false;
		
		$rootScope.title = '一家一农';
		
		//配置微信分享
		var shareInfo = {
			card_title:'一家一农',
			card_desc:'每周团购深海野生海鲜，新鲜水果，种类齐全，品质至上',
			card_url:appconfig.apiUrl+'business/redirect?state=',
			card_icon:'http://dev.yijiayinong.com/assets/images/logo.png'
		};
		$wxBridge.configShare(shareInfo);
			
		// import data
		$scope.batch = batch;
		
		if($rootScope.search_val){
			$scope.val = $rootScope.search_val;
		}else{
			$scope.val = '';
		}
		
		if(batch.length == 0){
			$scope.searchBox = true;
			$scope.content = true;
			$scope.setWidth = true;
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
		
		var cicle = document.getElementById('cicle');
		
		$scope.focus = function(){
			$scope.searchBox = true;
			$scope.box = false;
			$scope.setWidth = true;
		}
		
		$scope.onkeydown = function(e){
			$rootScope.search_val = $scope.val;
			var keycode = window.event?e.keyCode:e.which;
			if(keycode == 13){
				$rootScope.search = 'search=' + $scope.val;
				$location.path('/freeIndex');
				$route.reload();
			}
		}
		
		$scope.more = function(){
			console.log('look more');
		}
		
	});
	
}

module.exports = function(app){

	app.controller('FreeIndexController', function($route,$scope, $data, $location, batch, $rootScope,$wxBridge){
	
		$scope.searchBox = false;
		$scope.box = true;
		$scope.content = false;
		
		$rootScope.title = '一家一农';
		
		//配置微信分享
		var shareInfo = {
			card_title:'你想要的，一家一农都可以团购！',
			card_desc:'专业野生海鲜，时令进口水果，任由你选择！舌尖上的美味，让生活更有滋味！',
			card_url:appconfig+'business/redirect?state=',
			card_icon:'http://dev.yijiayinong.com/assets/images/logo.jpg'
		};
		$wxBridge.configShare(shareInfo);
			
		// import data
		$scope.batch = batch;
		
		for(var i=0;i<batch.length;i++){
			var num = batch[i].covers.length;
			batch[i].covers.match = parseInt(Math.random()*(num),10);
		}

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
			$location.path("/index") ;
		}
		
		$scope.cancel = function(){
			$rootScope.search = null;
			$location.path("/");
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
				$location.path('/');
				$route.reload();
			}
		}
		
		$scope.more = function(){
			console.log('look more');
		}
		
	});
	
}

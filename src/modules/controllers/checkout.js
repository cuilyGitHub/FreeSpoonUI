module.exports = function(app){

	app.controller('CheckController', function($scope, $location, $data, $rootScope, $wxBridge, batch){

		if(!batch){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		
		if(batch.recent_obtain_name || batch.recent_obtain_mob){
			$scope.isTrue = false;
			$scope.mob = batch.recent_obtain_mob;
			$scope.name = batch.recent_obtain_name;
			
		}else{
			$scope.isTrue = true;
		}
		
		//配置微信分享
		$wxBridge.configShare(batch);
		
		//选择地址
		$scope.selectAddress = function(p){
			$scope.selectedAddress = p;
		}

		$rootScope.title = '订单确认';
	
		$scope.commodities = batch.products;
		
		$scope.totalPrice = batch.totalPrice;
		$scope.dispatchers = batch.dispatchers;
				
		$scope.back=function(){
			$location.path('/index');
		};

		$scope.addInfo=function(){
			$scope.isTrue = true;
			if($scope.name == batch.recent_obtain_name){
				$scope.name=batch.recent_obtain_name;
			}
			if($scope.mob == batch.recent_obtain_mob){
				$scope.mob=batch.recent_obtain_mob;
			}
		}		
		
		//点击支付
		$scope.pay = function(commodities){	
		
			if(!$scope.name || $scope.name.length == 0){
				alert("昵称不存在");
				return;
			}
			if(!$scope.mob || $scope.mob.length!=11){
				alert("电话不存在");
				return;
			}
			if(!$scope.selectedAddress){
				alert("请选择取货地址");
				return;
			}
			
			var puchared = [];
			for(var i = 0; i < batch.products.length; i++){
				var commodity = batch.products[i]; 
				if(!!commodity.num){
					puchared.push({
						product_id: commodity.id,
						quantity: commodity.num
					});
				}
			}
			var requestData={
				obtain_name: $scope.name,
				obtain_mob: $scope.mob,
				bulk_id: batch.id,
				dispatcher_id: $scope.selectedAddress.id,
				goods: puchared
			};

			$data.requestUnifiedOrder(requestData, function(data){
				$data.ordersData = data;
				$rootScope.orderId = data.id;
				$location.path('/payment').replace();
			});
		}
		
		
		
		//配送方式选项卡
		var box=document.getElementById('box');
		var tip=document.getElementById('tip');
		var oBox=box.getElementsByTagName("span");
		var oTip=tip.getElementsByTagName("div");
		function changeTab(nIndex){
			for(var i=0;i<oBox.length;i++){
				oTip[i].className = null;
				oBox[i].className = 'sinceTitle';
			}
			oTip[nIndex].className = "select";
			oBox[nIndex].className = "sinceTitle success";
		}
		for(var i=0;i<oBox.length;i++){
			oBox[i].index = i;
			oBox[i].onclick=function(){
				changeTab(this.index);
			}
		}
		
	});

}
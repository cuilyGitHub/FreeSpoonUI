module.exports = function(app){

	app.controller('CheckController', function($scope, $location, $data, $rootScope, $wxBridge, batch){

		//配置微信分享
		$wxBridge.configShare(batch);
		//设置head头里title
		$rootScope.title = '订单确认';
		
		//数据绑定
		$scope.commodities = batch.products;
		$scope.totalPrice = batch.totalPrice;
		$scope.storages = batch.storages;
		$scope.mob = batch.recent_obtain_mob;
		$scope.name = batch.recent_obtain_name;
		$scope.receive_mode = batch.receive_mode;
		
		//处理送货上门返回来的数据
		if(!$rootScope.userAddressInfo){
			$scope.userAddress = '请选择地址';
		}else{
			$scope.receive = 2;
			$scope.isReadonly = true;
			$scope.receive_mob = $rootScope.userAddressInfo.mob;
			$scope.receive_name = $rootScope.userAddressInfo.name;
			$scope.userAddress = $rootScope.userAddressInfo.address;
		}
		
		//控制tab选项卡
		function since(){
			$scope.isWrite = true;
			$scope.isReadonly = false;
			$scope.sinceTab = true;
			$scope.dispatchingTab = false;
			$scope.isSince = true;
			$scope.isDispatching = false;
		}
		function dispatching(){
			$scope.isWrite = false;
			$scope.isReadonly = true;
			$scope.sinceTab = false;
			$scope.dispatchingTab = true;
			$scope.isSince = false;
			$scope.isDispatching = true;
		}
		
		(function(){
			if(batch.receive_mode == 1){
				since();
				return
			}
			if(batch.receive_mode == 2){
				dispatching();
				return;
			}
			if(batch.receive_mode == 3&&!$rootScope.userAddressInfo){
				since();
			}else{
				dispatching();
			}
		})();

		//选择配送方式
		$scope.switch = function(code){
			$scope.receive = code;
			if($scope.receive == 1){
				since();
			}else{
				dispatching();
			}
		}
		
		//选择自提地址
		$scope.selectedAddress = batch.storages[0];
		$scope.selectAddress = function(p){
			$scope.selectedAddress = p;
		}
		
		//更新自提点用户信息
		$scope.watchName = function(){
			$scope.name=document.getElementById('nikeName').value;
		}
		$scope.watchMob = function(){
			$scope.mob=document.getElementById('mob').value;
		}
		
		//选择送货地址
		$scope.jumpAddress = function(){
			$rootScope.fromCheckout = true;
			$location.path('/update_address');
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
			if($scope.receive_mode == 1&&!$scope.selectedAddress){
				alert("请选择取货地址");
				return;
			}
			if($scope.receive == 2&&!$rootScope.userAddressInfo){
				alert("请选择收货地址");
				return;
			}else if($scope.receive_mode == 2&&!$rootScope.userAddressInfo){
				alert("请选择收货地址");
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
			//处理用户选择的是自提还是送货,返回服务器需要的数据
			if($scope.receive_mode!=3){
				if($scope.receive_mode == 1){
					var requestData={
						receive_mode:$scope.receive_mode,
						obtain_name: $scope.name,
						obtain_mob: $scope.mob,
						bulk_id: batch.id,
						storage_id: $scope.selectedAddress.id,
						goods: puchared
					};
				}else{
					var requestData={
						receive_mode:$scope.receive_mode,
						obtain_name: $scope.name,
						obtain_mob: $scope.mob,
						bulk_id: batch.id,
						shippingaddress_id: $rootScope.userAddressInfo.id,
						goods: puchared
					};
				}
			}else{
				if(!$scope.receive){
					$scope.receive = 1;
				}
				if($scope.receive == 1){
					var requestData={
						receive_mode:$scope.receive,
						obtain_name: $scope.name,
						obtain_mob: $scope.mob,
						bulk_id: batch.id,
						storage_id: $scope.selectedAddress.id,
						goods: puchared
					};
				}else{
					var requestData={
						receive_mode:$scope.receive,
						obtain_name: $scope.name,
						obtain_mob: $scope.mob,
						bulk_id: batch.id,
						shippingaddress_id: $rootScope.userAddressInfo.id,
						goods: puchared
					};
				}
			}
			if(document.getElementById('note').value){
				requestData.comments = document.getElementById('note').value;
			}
			
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
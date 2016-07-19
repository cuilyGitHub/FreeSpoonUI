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
			$scope.tel = batch.recent_obtain_mob;
			$scope.nickName = batch.recent_obtain_name;
			
			$('#nikeName')[0].value=batch.recent_obtain_name;
			$('#mob')[0].value=batch.recent_obtain_mob;
			
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
			if($('#nikeName')[0].value == batch.recent_obtain_name){
				$('#nikeName')[0].value=batch.recent_obtain_name;
			}
			if($('#mob')[0].value == batch.recent_obtain_mob){
				$('#mob')[0].value=batch.recent_obtain_mob;
			}
		}
		
		$scope.getMob = function(){
			if(!$('#nikeName')[0].value){
				return;
			}
			if($('#mob')[0].value){
				$scope.tel = $('#mob')[0].value;
			}else{
				$('#mob')[0].value = $scope.tel;
			}
		}
		$scope.getName = function(){
			if(!$('#nikeName')[0].value){
				return;
			}
			if($('#nikeName')[0].value){
				$scope.nickName = $('#nikeName')[0].value;
			}else{
				$('#nikeName')[0].value = $scope.nickName;
			}
		}
		
		
		//点击支付
		$scope.pay = function(commodities){	
		
			if(!$scope.nickName || $scope.nickName.length == 0){
				alert("昵称不存在");
				return;
			}
			if(!$scope.tel || $scope.tel.length == 0){
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
				obtain_name: $scope.nickName,
				obtain_mob: $scope.tel,
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
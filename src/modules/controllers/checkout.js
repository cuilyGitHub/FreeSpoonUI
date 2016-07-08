module.exports = function(app){

	app.controller('CheckController', function($scope, $location, $data, $history, $rootScope, $wxBridge, batch){
		
		if(!batch){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		if($rootScope.auth || $rootScope.auth.mob_user){
			$scope.isTrue = false;
			$scope.tel = $rootScope.auth.mob_user.mob;
			$scope.nickName = $rootScope.auth.mob_user.wx_nickname;
		}else{
			$scope.isTrue = true;
		}
		
		//配置微信分享
		$wxBridge.configShare(batch);
		
		//选择地址
		$scope.selectAddress = function(p){
			$scope.selectedAddress = p;
		}

		$scope.commodities = batch.products;
		$scope.totalPrice = batch.totalPrice;
		$scope.dispatchers = batch.dispatchers;
				
		$scope.back=function(){
			$location.path('/index');
		};
		
		//onblur get mob and name
		
		$scope.focus = function(){
			var name = $('#nikeName')[0].value;
			var mob = $('#mob')[0].value;
			if(name == '填写姓名'){
				$('#nikeName')[0].value='';
			}
			if(mob == '填写电话'){
				$('#mob')[0].value='';
			}
		}
		
		$scope.addInfo=function(){
			$scope.isTrue = true;
			$('#nikeName')[0].value = null;
			$('#mob')[0].value = null;
		}
		
		$scope.getMob = function(){
			if($('#mob')[0].value){
				$scope.tel = $('#mob')[0].value;
			}else{
				$('#mob')[0].value = $scope.tel;
			}
		}
		$scope.getName = function(){
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
				//记录当前页面
				$history.getHistory();
				$data.ordersData = data;
				$rootScope.orderId = data.id;
				$location.path('/payment');
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
module.exports = function(app){

	app.controller('CheckController', function($scope, $location, $data, $history, $rootScope, batch){
		
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
		
		//选择地址
		$scope.selectAddress = function(p){
			$scope.selectedAddress = p;
		}

		$scope.commodities = batch.products;
		$scope.totalPrice = batch.totalPrice;
		$scope.dispatchers = batch.dispatchers;
			
		//设置header头左侧按钮状态	
		if($history.urlQueue.length>0){
			$scope.icoStatus=false;
			$scope.back=function(){
				$location.path($history.urlQueue[0]);
			};
		}else{
			$scope.icoStatus=true;
			$scope.back=function(){
				alert('关闭');
			};
		}
		//onblur get mob and name
		$scope.getMob = function(){
			$scope.tel = $('#mob')[0].value;
		}
		$scope.getName = function(){
			$scope.nickName = $('#nikeName')[0].value;
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
				//$data.prePromptPay = true;
				$data.ordersData = data;
				$location.path('/payment');
			});
		}
		
		$scope.addInfo=function(){
			$scope.isTrue = true;
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
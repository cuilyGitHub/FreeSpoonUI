module.exports = function(app){

	app.controller('CheckController', function($scope, $location, $data, $history, checkoutInfo){
		
		if(!$data.openId){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		if(!checkoutInfo){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		$scope.tel = checkoutInfo.tel;
		$scope.nickName = checkoutInfo.nickName;
		$scope.address = checkoutInfo.dists;
		
		$scope.selectAddress = function(p){
		$scope.selectedAddress = p;
		}

		var batch = $data.preData;
		if(!batch){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}

		$scope.commodities = batch.commodities;
		$scope.totalPrice = batch.totalPrice;
			
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
			for(var i = 0; i < batch.commodities.length; i++){
				var commodity = commodities[i]; 
				if(!!commodity.num){
					puchared.push({
						id: commodity.id,
						num: commodity.num
					});
				}
			}
			var requestData={
				openid: $data.openId,
				nickname: $scope.nickName,
				tel: $scope.tel,
				batch_id: batch.id,
				dist_id: $scope.selectedAddress.id,
				puchared: puchared,
				ipaddress: '127.0.0.1'
			};
			
			$data.requestUnifiedOrder(requestData, function(orderId){
				if(!orderId){
					alert('支付失败，服务器异常');
					return;
				}
				$data.prePromptPay = true;
				$location.path('/order/{orderId}'.assign({orderId: orderId}));
			});
		}
		
		$scope.isTrue=false;
		$scope.addInfo=function(){
			$scope.isTrue = true;
		}
		
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
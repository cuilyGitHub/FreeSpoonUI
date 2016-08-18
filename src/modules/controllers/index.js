'use strict';

module.exports = function(app){
	
	app.controller('IndexController', function($scope, $location, $data, $wxBridge, batch, $rootScope, $interval, $shopCart){
		
		//配置微信分享
		$wxBridge.configShare(batch);
		
		//save all shopCart data
		$shopCart.shopCartData = batch;
		
		// import data
		$scope.batch = batch;
		$scope.reseller = batch.reseller;
		$data.reseller = batch.reseller;
		$scope.commodities = batch.products;
		$scope.overDay= batch.dead_time - batch.standard_time;
		
		$rootScope.title = batch.title;
		
		$scope.mob = '';
		$scope.code = '';
		
		//phone message code
		$scope.paracont = '获取验证码';
		$scope.paraevent = false;
		
		//计算时间
		(function(){
			var start_time=batch.standard_time/1000;
			var dead_time = batch.dead_time/1000;
			var val = (dead_time - start_time)/1000;
			var day = Math.floor(val/(24*60*60));
			var hour = Math.floor((val-day*24*60*60)/3600);
			$scope.day = day;
			$scope.hour = hour;
		})();

		// watch commodities (Update totalNum and totalPrice)
		$scope.$watch('commodities', function(newValue, oldValue){
			if(!newValue){
				return;	
			}
			var totalNum = 0;
			var totalPrice = 0;
			
			for(var i = 0; i < newValue.length; i++){
				var commodity = newValue[i];
				if(!!commodity.num){
					totalNum += commodity.num;
					totalPrice += commodity.num * commodity.unit_price;
				}
			}
			
			if(!totalNum){
				$scope.isMatter = false;
				$scope.isPopup = false;
				$scope.isAmount = false;
				$scope.isHeight = false;
			} else {
				$scope.isAmount = true;
			}
			
			$scope.totalNum = totalNum;
			$scope.totalPrice = totalPrice;
			batch.totalNum = totalNum;
			batch.totalPrice = totalPrice;
		}, true);
		
		$scope.checkout = function(){
			if(!$rootScope.auth || !$rootScope.auth.user){
				register();
			}else{
				if(!!batch.totalNum && batch.totalNum>0){
					$data.preData = null;
					$location.path("/checkout");
				}
			}
			
		};
		
		//手机注册弹窗
		function register(){
			$scope.isShow = true;
			$scope.isHeight = true;
		}
		
		$scope.register_hide = function(){
			$scope.isShow = false;
			$scope.isHeight = false;
		}
		
		$scope.addCommodity = function(commodity){
			if(!commodity.num){
				commodity.num = 0;
			}
			commodity.num += 1;
		};
		
		$scope.removeCommodity = function(commodity){
			if(!commodity.num){
				commodity.num = 0;
			}
			commodity.num -= 1;
			if(commodity.num < 0){
				commodity.num = 0;
			}
		};
		
		(function(status){
			$scope.hide = function(){
				status = false;
				$scope.popup();
			}
			$scope.popup = function(){
				if(status && $shopCart.shopCartData.totalNum > 0){
					status = false;
					$scope.isMatter = true;
					$scope.isPopup = true;
					$scope.isHeight = true;
				} else {
					status = true;
					$scope.isMatter = false;
					$scope.isPopup = false;
					$scope.isHeight = false;
				}
			}
		})(true);

		$scope.empty = function(){
			for(var i = 0; i< $scope.commodities.length; i++){
				var commodity = $scope.commodities[i];
				commodity.num = 0;
			}
		}
		
		$scope.jump=function(id){
			$rootScope.productsId = $scope.commodities[id].id;
			$location.path("/record");
		}
		
		$scope.goodsDetails=function(id){
			$shopCart.id = id;
			$rootScope.productsId = $scope.commodities[id].id;
			$location.path("/goodsDetails");
		}
		
		$scope.jumpOrders=function(){
			if(!$rootScope.auth || !$rootScope.auth.user){
				register();
			}else{
				$data.preData = null;
				$location.path("/orders");
			}
			
		}
		
		//手机验证码
		$scope.getCode=function(){
			var second = 60;
			var	timePromise = undefined;
			if(!$scope.mob){
				alert('请填写手机号');
				return;
			}
			if($scope.paraevent){
				return;
			}
			$data.mobCode_Request($scope.mob,function(){
				timePromise = $interval(function(){
					if(second<=0){
						$interval.cancel(timePromise);
						timePromise = undefined;
						
						second = 60;
						$scope.paracont = "获取验证码";
						$scope.paraclass = false;
						$scope.paraevent = false;  
					}else{
						$scope.paracont = second + "s后重试";  
						$scope.paraclass = true;
						$scope.paraevent = true;
						second--;  
					}
				},1000,100);
			});
		}
		
		$scope.postMob=function(){	
			if(!$scope.mob){
				alert('请填写手机号');
				return;
			}
			if(!$scope.code){
				alert('请填写验证码');
				return;
			}
			$data.bindMob($scope.mob,$scope.code,function(data){
				if(!data){
					alert('用户注册失败');
					return;
				}
				$scope.register_hide();
			});
		}
	});
}
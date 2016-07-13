'use strict';

module.exports = function(app){
	
	app.controller('IndexController', function($scope, $location, $data, $wxBridge, batch, $rootScope, $shopCart){
		
		if(!batch){
			$location.path("/error");
			return;
		}
		
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
				$(".__amount").css('display', 'none');
				$('.__overlay').css('display', 'none');
				$('.popup-window-from-bottom').css('display', 'none');
				$("#index").css("height", "100%");
				$("#index").css("overflow", "auto");
			} else {
				$(".__amount").css('display', 'block');
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
				register_hide();
				if(!!batch.totalNum && batch.totalNum>0){
					$data.preData = null;
					$location.path("/checkout");
				}
			}
			
		};
		
		//手机注册弹窗
		function register(){
			$('.__overlay').css({'display':'block','z-index':'9999'});
			$('.__register').css({'display':'block','z-index':'9999'});
			$("#index").css("height", "100vh");
			$("#index").css("overflow", "hidden");
		}
		
		function register_hide(){
			$('.__overlay').css({'display':'none','z-index':'0'});
			$('.__register').css({'display':'none','z-index':'0'});
			$("#index").css("height", "auth");
			$("#index").css("overflow", "auto");
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
		
		//手机购物车弹窗
		(function(status){
			$('.__overlay').on('click', function(){
				status = false;
				window.popup_window_from_bottom();
				register_hide();
			});
			window.popup_window_from_bottom = function(){
				if(status && batch.totalNum > 0){
					status = false;
					$('.__overlay').css('display', 'block');
					$('.popup-window-from-bottom').css("display", "block");
					$("#index").css("height", "100vh");
					$("#index").css("overflow", "hidden");
				} else {
					status = true;
					$('.__overlay').css('display', 'none');
					$('.popup-window-from-bottom').css('display', 'none');
					$("#index").css("height", "100%");
					$("#index").css("overflow", "auto");
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
				register_hide();
				$data.preData = null;
				$location.path("/orders");
			}
			
		}
		
		$scope.getCode=function(){
			$scope.mob = $(".__mob")[0].value;
			if(!$scope.mob){
				alert('请填写手机号');
				return;
			}
			$data.mobCode_Request($scope.mob,function(){
				alert('验证码已发送至您的手机！')
			});
		}
		
		$scope.postMob=function(){	
			$scope.mob = $(".__mob")[0].value;
			$scope.code = $(".__code")[0].value;
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
				register_hide();
			});
		}
	});
}
module.exports = function(app){

	app.controller('GoodsDetailsController', function($scope, $data, $location, batch, $shopCart, $rootScope, $history){
		console.log($shopCart);
		 
		if(!batch){
			$location.path("/error");
			return;
		}
		//from server api
		$scope.batch = batch;
		
		//from services shopCart
		$scope.shopCartData = $shopCart.shopCartData;
		$scope.shopCartNum = $shopCart.shopCartData.products[$shopCart.id].num;
		
		// watch shopCartData (Update totalNum and totalPrice)
		$scope.$watch('shopCartData', function(newValue, oldValue){
			if(!newValue){
				return;	
			}
			
			var totalNum = 0;
			var totalPrice = 0;
			
			for(var i=0;i<$shopCart.shopCartData.products.length;i++){
				var commodity = $shopCart.shopCartData.products[i];
				if(!!commodity.num){
					totalNum += commodity.num;
					totalPrice += commodity.num * commodity.unit_price;
				}
			}
			
			if(!$shopCart.shopCartData.totalNum){
				$(".__amount").css('display', 'none');
				$('.__overlay').css('display', 'none');
				$('.popup-window-from-bottom').css('display', 'none');
				$("#index").css("height", "100%");
				$("#index").css("overflow", "auto");
			} else {
				$(".__amount").css('display', 'block');
			}
			
			$shopCart.shopCartData.totalNum = totalNum;
			$shopCart.shopCartData.totalPrice = totalPrice;
			
		}, true);
		
		$scope.addCommodity = function(commodity){
			if(!commodity.num){
				commodity.num = 0;
			}
			commodity.num += 1;
			$scope.shopCartNum = $shopCart.shopCartData.products[$shopCart.id].num;
		};
		
		$scope.addShopCartNum = function(commodity){
			if(!$shopCart.shopCartData.products[$shopCart.id].num){
				$shopCart.shopCartData.products[$shopCart.id].num = 0;
			}
			$shopCart.shopCartData.products[$shopCart.id].num += 1;
			$scope.shopCartNum = $shopCart.shopCartData.products[$shopCart.id].num;
		};
		
		$scope.removeCommodity = function(commodity){
			if(!commodity.num){
				commodity.num = 0;
			}
			commodity.num -= 1;
			if(commodity.num < 0){
				commodity.num = 0;
			}
			$scope.shopCartNum = $shopCart.shopCartData.products[$shopCart.id].num;
		};
		
		$scope.removeShopCartNum = function(commodity){
			if(!$shopCart.shopCartData.products[$shopCart.id].num){
				$shopCart.shopCartData.products[$shopCart.id].num = 0;
			}
			$shopCart.shopCartData.products[$shopCart.id].num -= 1;
			
			if($shopCart.shopCartData.products[$shopCart.id].num < 0){
				$shopCart.shopCartData.products[$shopCart.id].num = 0;
			}
			$scope.shopCartNum = $shopCart.shopCartData.products[$shopCart.id].num;
		};
		
		(function(status){
			$('.__overlay').on('click', function(){
				status = false;
				window.popup_window_from_bottom();
			});
			window.popup_window_from_bottom = function(){
				if(status && $shopCart.shopCartData.totalNum > 0){
					status = false;
					$('.__overlay').css('display', 'block');
					$('.popup-window-from-bottom').css("display", "block");
					$("#index").css("height", "10rem");
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
		
		$scope.checkout = function(){
			if(!$rootScope.auth || !$rootScope.auth.user){
				register();
			}else{
				register_hide();
				if(!!$shopCart.shopCartData.totalNum && $shopCart.shopCartData.totalNum>0){
					$history.getHistory();
					$data.preData = batch;
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

		$scope.empty = function(){
			for(var i = 0; i< $shopCart.shopCartData.products.length; i++){
				var commodity = $shopCart.shopCartData.products[i];
				commodity.num = 0;
			}
		}
		
		$scope.back=function(){
			$location.path("/index");
		};
	});

}
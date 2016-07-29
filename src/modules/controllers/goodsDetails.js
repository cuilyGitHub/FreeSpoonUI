module.exports = function(app){

	app.controller('GoodsDetailsController', function($scope, $data, $location, batch, $shopCart, $rootScope){
	 
		if(!batch){
			$location.path("/error");
			return;
		}
		
		$rootScope.title = '商品详情';
		$scope.mob = '';
		$scope.code = '';
		
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
				$scope.isMatter = false;
				$scope.isPopup = false;
				$scope.isAmount = false;
				$scope.isHeight = false;
			} else {
				$scope.isAmount = true;
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
		
		//手机购物车弹窗
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
		
		$scope.checkout = function(){
			if(!$rootScope.auth || !$rootScope.auth.user){
				register();
			}else{
				if(!!$shopCart.shopCartData.totalNum && $shopCart.shopCartData.totalNum>0){
					$data.preData = batch;
					$location.path("/checkout");
				}
			}
			
		};
		
		//手机注册弹窗
		function register(){		
			$scope.isRegister = true;
			$scope.isHeight = true;
		}
		
		$scope.register_hide = function(){
			$scope.isRegister = false;
			$scope.isHeight = false;
		}

		$scope.empty = function(){
			for(var i = 0; i< $shopCart.shopCartData.products.length; i++){
				var commodity = $shopCart.shopCartData.products[i];
				commodity.num = 0;
			}
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
		
		$scope.getCode=function(){
			if(!$scope.mob){
				alert('请填写手机号');
				return;
			}
			$data.mobCode_Request($scope.mob,function(){
				alert('验证码已发送至您的手机！')
			});
		}
		
	});

}
module.exports = function(app){

	app.controller('GoodsDetailsController', function($scope, $data, $location, batch, $shopCart, $rootScope, $wxBridge){

		$rootScope.title = '商品详情';
		$scope.mob = '';
		$scope.code = '';
		
		//配置分享信息
		var shareInfo = {
			card_title:'我准备买新鲜美味的'+batch.title+'，快来拼团吧！',
			card_desc:batch.desc,
			card_url:appconfig+'business/redirect/index?state='+$rootScope.id,
			card_icon:batch.cover
		};
		$wxBridge.configShare(shareInfo);
		
		//phone message code
		$scope.paracont = '获取验证码';
		$scope.paraevent = false;
		
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
			if(commodity.purchased_count){
				var surplus = commodity.stock - commodity.purchased_count;
			}else{
				var surplus = commodity.stock;
			}
			if(commodity.limit>0){
				if(commodity.num < surplus){
					if(commodity.num < commodity.limit){
						commodity.num += 1;
					};
				};
			}else{
				if(commodity.num < surplus){
					commodity.num += 1;
				};
			}
		};
		
		$scope.addShopCartNum = function(commodity){
			if($shopCart.shopCartData.status!=0){
				return;
			}
			if(!$shopCart.shopCartData.products[$shopCart.id].num){
				$shopCart.shopCartData.products[$shopCart.id].num = 0;
			}
			if(commodity.purchased_count){
				var surplus = commodity.stock - commodity.purchased_count;
			}else{
				var surplus = commodity.stock;
			}
			if(commodity.limit>0){
				if($shopCart.shopCartData.products[$shopCart.id].num < surplus){
					if($shopCart.shopCartData.products[$shopCart.id].num < commodity.limit){
						$shopCart.shopCartData.products[$shopCart.id].num += 1;
						$scope.shopCartNum = $shopCart.shopCartData.products[$shopCart.id].num;
					};
				};
			}else{
				if($shopCart.shopCartData.products[$shopCart.id].num < surplus){
					$shopCart.shopCartData.products[$shopCart.id].num += 1;
					$scope.shopCartNum = $shopCart.shopCartData.products[$shopCart.id].num;
				};
			}
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
			if($shopCart.shopCartData.status!=0){
				return;
			}
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
				$scope.shopCartNum = commodity.num;
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
		
	});

}
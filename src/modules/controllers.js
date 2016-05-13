// controllers.js

'use strict';

module.exports = function(app){
	
	app.controller('IndexController', function($scope, $location, $data, $wxBridge, batch){
		
		if(!batch){
			$location.path("/error");
			return;
		}
		
		// Configure WeChat share information
		$data.getWXShareInfo(batch.id, function(shareInfo){
			$wxBridge.configShare(shareInfo);
		});
		
		// import data
		$scope.commodities = batch.commodities;
		$scope.sponsor = batch.sponsor;
		$scope.offered = batch.offered;

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
					totalPrice += commodity.num * commodity.price;
				}
			}
			if(!totalNum){
				$(".__amount").css('display', 'none');
				$('.__overlay').css('display', 'none');
				$('.popup-window-from-bottom').css('display', 'none');
			} else {
				$(".__amount").css('display', 'block');
			}
			$scope.totalNum = totalNum;
			$scope.totalPrice = totalPrice;
			batch.totalNum = totalNum;
			batch.totalPrice = totalPrice;
		}, true);
		
		$scope.checkout = function(){
			if(!batch.totalNum){
				alert("请选择商品");
			} else {
				$data.preData = batch;
				$location.path("/checkout/{batchId}".assign({batchId: batch.id}));
			}
		};
		
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
			$('.__overlay').on('click', function(){
				status = false;
				window.popup_window_from_bottom();
			});
			window.popup_window_from_bottom = function(){
				if(status && batch.totalNum > 0){
					status = false;
					$('.__overlay').css('display', 'block');
					$('.popup-window-from-bottom').css("display", "block");
					$("#index").css("overflow", "hidden");
				} else {
					status = true;
					$('.__overlay').css('display', 'none');
					$('.popup-window-from-bottom').css('display', 'none');
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
		
	});

	app.controller('CheckController', function($scope, $location, $data, checkoutInfo){
		
		if(!$data.openId){
			$location.path("/error");
			return;
		}
		if(!checkoutInfo){
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
			$location.path("/error");
			return;
		}

		$scope.commodities = batch.commodities;
		$scope.totalPrice = batch.totalPrice;
			
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
				$location.path('/order/{orderId}/{promptPay}'.assign({orderId: orderId, promptPay: true}));
			});
		}
		
	});

	app.controller('OrderController', function($scope, $location, $data, $wxBridge, orderInfo, promptPay){
		
			if(!orderInfo || !orderInfo.data || !orderInfo.payRequest){
				$location.path("/error");
				return;
			}

			$scope.order = orderInfo.data;
						
			$scope.pay = function(){
				$wxBridge.pay(orderInfo.payRequest, function(){
					$scope.$apply(function(){
						$location.path("/share/{orderId}".assign({orderId: orderInfo.data.id}));
					});
				});
			}
			if(promptPay){
				$scope.pay();
			}
			
			$scope.undo = function(){
				$data.undo(orderInfo.data.id, function(result){
					if(result){
						$location.path("/orders");
						return;
					} else {
						alert('取消订单失败');
					}
				});
			}
			
	});

	app.controller('ShareController', function($scope, $location, orderId){
		
		$data.requestOrderAmount(orderId, function(orderAmount){
			if(!orderAmount){
				orderAmount = 'X';
			}
			$scope.orderAmount = orderAmount;
		});
		
		$scope.jump = function(){
			$location.path("/order/{orderId}".assign({orderId: orderId}));
		}
		
	});

	app.controller('OrdersController', function($scope, $routeParams,$data,$location,$http,$wxBridge,orders){
		
		if(!orders){
			$location.path("/error");
			return;
		}
		
		$scope.orders = orders;
		
		$scope.openOrder = function(orderId, promptPay){
			if(promptPay){
				$location.path("/order/{orderId}/{promptPay}".assign({orderId: orderId, promptPay: promptPay}));
				return;
			}
			$location.path("/order/{orderId}".assign({orderId: orderId}));
		}
		
	});

	app.controller('ErrorController', function($scope){
		//TODO
	});

}
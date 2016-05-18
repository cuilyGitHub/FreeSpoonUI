// controllers.js

'use strict';

module.exports = function(app){
	
	app.controller('IndexController', function($scope, $location, $data, $history, $wxBridge, batch){
		
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
			if(!!batch.totalNum && batch.totalNum>0){
				$history.getHistory();
				$data.preData = batch;
				$location.path("/checkout/{batchId}".assign({batchId: batch.id}));
			}
		};
		
		$scope.jumpOrders=function(){
			$history.getHistory();
			$location.path("/orders");
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
			$('.__overlay').on('click', function(){
				status = false;
				window.popup_window_from_bottom();
			});
			window.popup_window_from_bottom = function(){
				if(status && batch.totalNum > 0){
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

		$scope.empty = function(){
			for(var i = 0; i< $scope.commodities.length; i++){
				var commodity = $scope.commodities[i];
				commodity.num = 0;
			}
		}
		
	});

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
		
	});

	app.controller('OrderController', function($scope, $location, $data, $history, $wxBridge, orderInfo){
		
			if(!orderInfo || !orderInfo.data || !orderInfo.payRequest){
				$data.preData={
					title:'参数错误',
					desc:'参数不存在'
				}
				$location.path("/error");
				return;
			}

			$scope.order = orderInfo.data;
			
			if($history.urlQueue.length>0){
				$scope.icoStatus=false;
				$scope.back=function(){
					$location.path('/orders');
				};
			}else{
				$scope.icoStatus=true;
				$scope.back=function(){
					alert('关闭');
				};
			}
			
			$scope.pay = function(){
				$wxBridge.pay(orderInfo.payRequest, function(){
					$scope.$apply(function(){
						$location.path("/share/{orderId}".assign({orderId: orderInfo.data.id}));
					});
				});
			}
			if($data.prePromptPay){
				$scope.pay();
			}
			$data.prePromptPay = false;
			
			$scope.orderConfirm=function(){
				var r=confirm('是否取消订单');
				if(r==true){
					alert('订单取消成功');
					$data.undo(orderInfo.data.id, function(result){
						if(result){
							$location.path("/orders");
							return;
						} else {
							alert('取消订单失败');
						}
					});
				}else{
					alert('订单取消失败');
				}
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

	app.controller('OrdersController', function($scope, $routeParams, $data, $history,$location, $http, $wxBridge, orders){
		
		if(!orders){
			$data.preData={
				title:'参数错误',
				desc:'参数不存在'
			}
			$location.path("/error");
			return;
		}
		
		$scope.orders = orders;
		
		 if($history.urlQueue.length>0){
				 $scope.icoStatus=false;
				 $scope.back=function(){
					 $location.path('/');
				 };
		 }else{
			 $scope.icoStatus=true;
			 $scope.back=function(){
				 alert('关闭');
			 };
		 }
		
		
		$scope.openOrder = function(orderId, promptPay){
			$history.getHistory();
			$data.prePromptPay = promptPay;
			$location.path("/order/{orderId}".assign({orderId: orderId}));
		}
		
	});

	app.controller('ShareController', function($scope, $location, $data, $wxBridge, orderId){
		
		$data.requestOrderAmount(orderId, function(orderAmount){
			if(!orderAmount){
				orderAmount = 'X';
			}
			$scope.orderAmount = orderAmount;
			$data.getWXShareInfo($data.lastBatchid, function(shareInfo){
				shareInfo.title=shareInfo.title+'(我是第'+$scope.orderAmount+'位接龙者)';
				$wxBridge.configShare(shareInfo);
			});
		});
		
		$scope.jump = function(){
			$location.path("/order/{orderId}".assign({orderId: orderId}));
		}
		
	});
	
	app.controller('ErrorController', function($scope,$data){
		//TODO
		if(!$data.preData){
			$scope.title = '错误',
			$scope.desc = '未知错误'
			return;
		}
		$scope.title = $data.preData.title;
		$scope.desc = $data.preData.desc;
		
		$data.preData = null;
	});
	
}
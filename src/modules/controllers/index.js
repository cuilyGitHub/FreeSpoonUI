'use strict';

module.exports = function(app){
	
	app.controller('IndexController', function($scope, $location, $data, $history, $wxBridge, batch){
		
		if(!batch){
			$location.path("/error");
			return;
		}
		
		// Configure WeChat share information
		/*$data.getWXShareInfo(batch.id, function(shareInfo){
			$wxBridge.configShare(shareInfo);
		});*/
		
		$wxBridge.configShare(batch);
		
		// import data
		$scope.batch = batch;
		$scope.reseller = batch.reseller;
		$scope.commodities = batch.products;

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
		
		$scope.jump=function(){
			$location.path("/record");
		}
		
		$scope.goodsDetails=function(){
			$location.path("/goodsDetails");
		}
		
	});
}
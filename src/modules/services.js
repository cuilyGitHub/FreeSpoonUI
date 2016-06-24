// services.js

'use strict';

var publicValue=require('./publicValue');

module.exports = function(app){
	
	app.service('$wxBridge', function($http, $location){
		
		var that = this;
		
		this.closeWindow=function(){
			wx.closeWindow();
		};
		
		this.configShare = function(shareInfo){
			wx.onMenuShareAppMessage({
				title: shareInfo.card_title, 
				desc: shareInfo.card_desc, 
				link: shareInfo.card_url, 
				imgUrl: shareInfo.card_icon,
				//type: '', 
				//dataUrl: '', 
				success: function () {
					//TODO
				},
				cancel: function () {
					//TODO
				}
		   });
		};
		
		this.pay = function(payRequest, callback){
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', payRequest, function(res){
					if(res.err_msg == "get_brand_wcpay_request:ok" ){
						callback();
					}
				}
			);
		};
		
	});

	app.service('$data', function($http, $location, $q, $rootScope){
		
		//this preData
		
		this.preData = null;
		
		var that = this;
		
		/*this.basicVerify = function(data){
			if(!data || !data.errcode){
				return false;
			}
			if(data.errcode != 'Success'){
				return false;
			}
			return true;
		}*/
		
		/*this.getStateFromUrl = function(){
			var urlParams = $location.search();
			if(!urlParams){
				return null;
			}
			return urlParams.state;
		}*/
		
		/*this.requestCheckoutInfo = function(batchId, cb){
			if(!that.openId){
				cb(null);
				return;
			}
			$http.post(publicValue.domain+"checkout", {
				batchId: batchId,
				openId: that.openId
			})
			.success(function(data){
				if(!that.basicVerify(data)){
					cb(null);
					return;
				}
				if(!data.res || !data.res.data){
					cb(null);
					return;
				}
				cb(data.res.data);
			})
			.error(function(){
				cb(null);
			});
		};*/
		
		this.requestOrders = function(cb){
			if(!that.openId){
				cb(null);
				return;
			}
			$http.post(publicValue.domain+"orders", {
				openId: that.openId
			})
			.success(function(data){
				if(!that.basicVerify(data)){
					cb(null);
					return;
				}
				if(!data.res || !data.res.data){
					cb(null);
					return;
				}
				cb(data.res.data);
			})
			.error(function(){
				cb(null);
			});
		};
		
		this.requestOrder = function(orderId, cb){
			$http.post(publicValue.domain+"order", {
				orderId: orderId
			})
			.success(function(data){
				if(!that.basicVerify(data)){
					cb(null);
					return;
				}
				if(!data.res){
					cb(null);
					return;
				}
				cb(data.res);
			})
			.error(function(){
				cb(null);
			});
		};
		
		this.undo = function(orderId, cb){
			$http.post(publicValue.domain+"undo", {
				orderId: orderId
			})
			.success(function(data){
				if(!that.basicVerify(data)){
					cb(false);
					return;
				}
				cb(true);
			})
			.error(function(){
				cb(false);
			});
		};
				
		this.requestOrderAmount = function(orderId, cb){
			$http.post(publicValue.domain+"orderAmount", {
				orderId: orderId
			})
			.success(function(data){
				if(!that.basicVerify(data)){
					cb(null);
					return;
				}
				if(!data.res){
					cb(null);
					return;
				}
				cb(data.res.orderAmount);
			})
			.error(function(){
				cb(null);
			});
		};

		this.getWXShareInfo = function(batchId, cb){
			$http.post(publicValue.domain+'shareInfo', {
				batchId: batchId
			})
			.success(function(data){
				if(data.res.data){
					cb(data.res.data);
					return;
				}
				if(!that.basicVerify(data)){
					cb(null);
					return;
				}
				if(!data.res || !data.res.data){
					cb(null);
					return;
				}
				cb(data.res.data);
			})
			.error(function(){
				cb(null);
			});
		}
				
		this.requestConfirm = function(cb){
			var state = that.getStateFromUrl();
			if(!state){
				cb(null);
				return;
			}
			params = state.split(',');
			if(params.length != 2){
				cb(null);
				return;
			}
			var batchId = params[0];
			var distId = params[1];
			if(!batchId || !distId){
				cb(null);
				return;
			}
			var code = that.getWXCodeFromUrl();
			if(!code){
				cb(null);
				return;
			}
			$http.post(publicValue.domain+"confirm", {
				batchId: batchId,
				distId: distId,
				code: code
			})
			.success(function(data){
				if(!that.basicVerify(data)){
					cb(null);
					return;
				}
				if(data.res.data.offered.date == 0){
					cb(null);
					return;
				}
				if(!data.res || !data.res.data){
					cb(null);
					return;
				}
				cb(data.res.data);
			})
			.error(function(){
				cb(null);
			});
		};
		
		
		
		this.bindMob = function(mob, code, cb){
			var defer = $q.defer();
			$http({
				method:'post',
				url:'http://yijiayinong.com/api/business/bind',
				data:{
					mob:mob,
					code:code
				},
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				$rootScope.auth = data;
				defer.resolve(data);
				cb(data);
			})
			.error(function(data){
				defer.reject(data);
				cb(null);
			});
			return defer.promise
		};
		
		this.requestUnifiedOrder = function(requestData, cb){
			$http.post(publicValue.domain+"unifiedOrder", requestData)
			$http({
				method:'post',
				url:'http://yijiayinong.com/api/business/orders/',
				data:requestData,
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			})
			.error(function(){
				cb(null);
			});
		};	
	});
	
	app.service('$history',function($http, $location){
		this.urlQueue=[];
		var that=this;
		
		this.getHistory=function(){
			if(that.urlQueue>2){
				that.urlQueue.shift();
			}
			 var getUrl=$location.$$path;
			 that.urlQueue.unshift(getUrl);
		}
		
	});
	
	app.service('$shopCart',function($http, $location){
			//save all shopCart data
	});

}
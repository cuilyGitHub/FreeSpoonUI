// services.js

'use strict';

module.exports = function(app){
	
	app.service('$wxBridge', function($http, $location){
		
		var that = this;
		
		this.closeWindow=function(){
			wx.closeWindow();
		};
		
		this.configShare = function(shareInfo){
			wx.onMenuShareAppMessage({
				title: shareInfo.title, 
				desc: shareInfo.desc, 
				link: shareInfo.shareUrl, 
				imgUrl: shareInfo.imgUrl,
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

	app.service('$data', function($http, $location){
		
		//this.openId;
		//this.batchId;
		
		this.preData = null;
		
		var that = this;
		
		this.basicVerify = function(data){
			if(!data || !data.errcode){
				return false;
			}
			if(data.errcode != 'Success'){
				return false;
			}
			return true;
		}
		
		this.getWXCodeFromUrl = function(){
			var urlParams = $location.search();
			if(!urlParams){
				return null;
			}
			return urlParams.code;
		}
		
		this.getStateFromUrl = function(){
			var urlParams = $location.search();
			if(!urlParams){
				return null;
			}
			return urlParams.state;
		}
		
		this.requestBatch = function(cb){
			if(!!that.lastBatch){
				cb(that.lastBatch);
				return;
			}
			var batchId = that.getStateFromUrl();
			if(!batchId){
				cb(null);
				return;
			}
			var code = that.getWXCodeFromUrl();
			if(!code){
				cb(null);
				return;
			}
			$http.post("http://yijiayinong.com/api/batch", {
				batchId: batchId,
				code: code,
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
				that.openId = data.res.openId;
				that.lastBatch = data.res.data;
				that.lastBatchid = data.res.data.id;
				cb(data.res.data);
			})
			.error(function(){
				cb(null);
			});
		};
		
		this.requestCheckoutInfo = function(batchId, cb){
			if(!that.openId){
				cb(null);
				return;
			}
			$http.post("http://yijiayinong.com/api/checkout", {
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
		};
		
		this.requestOrders = function(cb){
			if(!that.openId){
				cb(null);
				return;
			}
			$http.post("http://yijiayinong.com/api/orders", {
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
			$http.post("http://yijiayinong.com/api/order", {
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
			$http.post("http://yijiayinong.com/api/undo", {
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
				
		this.requestUnifiedOrder = function(requestData, cb){
			$http.post("http://yijiayinong.com/api/unifiedOrder", requestData)
			.success(function(data){
				if(!that.basicVerify(data)){
					cb(null);
					return;
				}
				if(!data.res){
					cb(null);
					return;
				}
				cb(data.res.orderId);
			})
			.error(function(){
				cb(null);
			});
		};
				
		this.requestOrderAmount = function(orderId, cb){
			$http.post("http://yijiayinong.com/api/orderAmount", {
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
			$http.post('http://yijiayinong.com/api/shareInfo', {
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
		
	})

}
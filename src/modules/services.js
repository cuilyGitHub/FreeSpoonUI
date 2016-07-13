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
		
		this.pay = function(wx_pay_request, callback){
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', wx_pay_request, function(res){
					if(res.err_msg == "get_brand_wcpay_request:ok" ){
						callback();
					}
				}
			);
		};
		
	});

	app.service('$data', function($q, $http, $location, $rootScope){
		
		//this preData
		//this Resellers (团主信息) from index.js
		//this address_id from update_address.js
		//this recipesId from recipes.js
		//this dishsId from dishs.js
		
		this.preData = null;
		
		var that = this;
				
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
		
		
		//绑定手机
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
		
		//get token
		this.authRes = function(cb){
			if($rootScope.auth){
				cb($rootScope.auth);
				return;
			}else{
				var code = $location.search().code;
				if(!code){
					alert('code不存在');
					return;
				}
				$http.post('http://yijiayinong.com/api/business/weixin',{code:code})
				.success(function(data){
				if(!data){
					cb(null);
					return;
				}
					cb(data)
				})
				.error(function(){
					cb(null);
				});
			}
			
		}
		
		//团购列表
		this.bulksRes = function(cb){
		$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/bulks/',
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
		}
		
		//search list
		this.searchRes = function(search,cb){
		$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/bulks/?'+search,
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
		}
		
		//团购详情
		this.bulkRes = function(batch,cb){
		$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/bulks/'+batch+'/',
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
		}
		
		//商品详情
		this.products = function(productsId,cb){
		$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/products/'+productsId+'/',
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
		}
		
		//成交记录
		this.historys= function(productsId,cb){
		$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/purchasedproducthistorys/',
				params:{
					'product_id':productsId
				},
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
		}
		
		//订单列表页
		this.requestOrders = function(cb){
			$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/orders/',
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
		
		//post services post order data
		this.requestUnifiedOrder = function(requestData, cb){
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
		
		//get weixin pay interface 
		this.payRequest = function(requestUrl, balanceStatus, cb){
			$http({
				method:'get',
				url:requestUrl,
				params:{
					'balance':balanceStatus
				},
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
		//get order data
		this.orderRequest = function(orderId, cb){
			$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/orders/'+orderId+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
		//delete order data
		this.orderDel = function(orderId, cb){
			$http({
				method:'delete',
				url:'http://yijiayinong.com/api/business/orders/'+orderId+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
		//get mob code
		this.mobCode_Request = function(mob, cb){
			$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/sms/'+mob+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
		this.userRequest = function(code,cb){
			$http({
				method:'get',
				url:'http://yijiayinong.com/api/auth/user/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
		this.add_address = function(address_data, cb){
			$http({
				method:'post',
				url:'http://yijiayinong.com/api/business/shippingaddresses/',
				data:address_data,
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
		
		//get one user_address infor
		this.get_address = function(address_id, cb){
			$http({
				method:'get',
				url:'http://yijiayinong.com/api/business/shippingaddresses/'+address_id+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
		//del address
		this.del_address = function(address_id, cb){
			$http({
				method:'delete',
				url:'http://yijiayinong.com/api/business/shippingaddresses/'+address_id+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
		this.put_address = function(address_id, address_info, cb){
			$http({
				method:'put',
				url:'http://yijiayinong.com/api/business/shippingaddresses/'+address_id+'/',
				data:address_info,
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.success(function(data){
				if(!data){
					cb(null);
					return;
				}
				cb(data);
			});
		};	
		
	});
	
	//get index.html data and keep in $shopCart
	app.service('$shopCart',function($http, $location){
			//keep all shopCart data
	});

}
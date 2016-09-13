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
			wx.onMenuShareTimeline({
				title: shareInfo.card_title, // 分享标题
				link: shareInfo.card_url, // 分享链接
				imgUrl: shareInfo.card_icon, // 分享图标
				success: function () { 
					// 用户确认分享后执行的回调函数
				},
				cancel: function () { 
					// 用户取消分享后执行的回调函数
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
		
		//true:弹出服务器错误信息
		$rootScope.debug = false;
		
		this.preData = null;
		var that = this;

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
				};
				$http.post(appconfig+'business/weixin',{code:code})
				.then(function(resp){
					if(!resp){
						cb(null);
						return;
					}
					cb(resp.data);
				},function(resp){
					if($rootScope.debug){
						alert(JSON.stringify(resp));
						return;
					}
					cb(null);
				});
			}
		}
		
		//绑定手机
		this.bindMob = function(mob, code, cb){
			var defer = $q.defer();
			$http({
				method:'post',
				url:appconfig+'business/bind',
				data:{
					mob:mob,
					code:code
				},
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				$rootScope.auth = resp.data;
				defer.resolve(resp.data);
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				defer.reject(resp);
				cb(null);
			});
			return defer.promise
		};
		
		//刷新接口
		this.refresh = function(token,cb){
			$http({
				method:'post',
				url:appconfig+'auth/refresh',
				data:{
					token:token,
				},
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(null);
			});
		}
		
		//团购列表
		this.bulksRes = function(cb){
		$http({
				method:'get',
				url:appconfig+'business/bulks/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(null);
			});
		}
		
		//搜索列表
		this.searchRes = function(search,cb){
		$http({
				method:'get',
				url:appconfig+'business/bulks/?'+search,
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(null);
			});
		}
		
		//团购详情
		this.bulkRes = function(batch,cb){
		$http({
				method:'get',
				url:appconfig+'business/bulks/'+batch+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(null);
			});
		}
		
		//商品详情
		this.products = function(productsId,cb){
		$http({
				method:'get',
				url:appconfig+'business/products/'+productsId+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(null);
			});
		}
		
		//成交记录
		this.historys= function(productsId,url,cb){
		$http({
				method:'get',
				url:url,
				params:{
					'product_id':productsId
				},
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(null);
			});
		}
		
		//订单列表
		this.requestOrders = function(cb){
			$http({
				method:'get',
				url:appconfig+'business/orders/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(null);
			});
		};	
		
		//post services post order data
		this.requestUnifiedOrder = function(requestData,cb){
			$http({
				method:'post',
				url:appconfig+'business/orders/',
				data:requestData,
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				//cb(null);
				cb(resp.data);
			});
		};
		
		//支付接口
		this.payRequest = function(requestUrl, balanceStatus, cb){
			$http({
				method:'get',
				url:requestUrl,
				params:{
					'balance':balanceStatus
				},
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cb(resp.data);
			});
		};	
		
		//订单详情
		this.orderRequest = function(orderId, cb){
			$http({
				method:'get',
				url:appconfig+'business/orders/'+orderId+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				wx.closeWindow();
			});
		};	
		
		//delete order data
		this.orderDel = function(orderId, cb){
			$http({
				method:'delete',
				url:appconfig+'business/orders/'+orderId+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};	
		
		//get mob code
		this.mobCode_Request = function(mob, cb){
			$http({
				method:'get',
				url:appconfig+'business/sms/'+mob+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};	
		
		//get user center data
		this.userRequest = function(code,cb){
			$http({
				method:'get',
				url:appconfig+'auth/user/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};	
		
		//地址列表
		this.addressRequest = function(cb){
			$http({
				method:'get',
				url:appconfig+'business/shippingaddresses/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};
		
		//添加地址
		this.add_address = function(address_data, cb){
			$http({
				method:'post',
				url:appconfig+'business/shippingaddresses/',
				data:address_data,
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};	
		
		//get one user_address infor
		this.get_address = function(address_id, cb){
			$http({
				method:'get',
				url:appconfig+'business/shippingaddresses/'+address_id+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};	
		
		//del address
		this.del_address = function(address_id, cb){
			$http({
				method:'delete',
				url:appconfig+'business/shippingaddresses/'+address_id+'/',
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};	
		
		//修改地址
		this.put_address = function(address_id, address_info, cb){
			$http({
				method:'put',
				url:appconfig+'business/shippingaddresses/'+address_id+'/',
				data:address_info,
				headers:{'Authorization':'JWT '+ $rootScope.auth.token}
			})
			.then(function(resp){
				if(!resp){
					cb(null);
					return;
				}
				cb(resp.data);
			},function(resp){
				if($rootScope.debug){
					alert(JSON.stringify(resp));
					return;
				}
				cd(null);
			});
		};	
		
	});
	
	//get index.html data and keep in $shopCart
	app.service('$shopCart',function($http, $location){
			//keep all shopCart data
	});

}

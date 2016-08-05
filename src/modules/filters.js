// filters.js

'use strict';

module.exports = function(app){
	
	app.filter('convert', function(){
		return function(val){
			if(!!val){
				val = (val / 100).toFixed(2);
			}
			return val;
		}
	});

	app.filter('safenum', function(){
		return function(val){
			if(!val){
				return 0;
			}
			return val;
		}
	});

	app.filter('int',function(){
		return function(val){
			if(!!val){
				val = parseInt(val / 100);
			}
			return val;
		}
	});

	app.filter('fraction',function(){
		return function(val){
			if(!!val){
				val = (val % 100);
				if(val.toString().length<2){
					val = '0' + val;
				}
			}
			return val;
		}
	});
	
	//格式化时间
	Date.prototype.Format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	
	app.filter('format',function(){
		return function(val){
			val=val/1000;
			if(!!val){
				val = new Date(val).Format("yyyy-MM-dd hh:mm:ss");
			}
			return val;
		}
	});
	
	app.filter('format_month',function(){
		return function(val){
			val=val/1000;
			if(!!val){
				val = new Date(val).Format("MM-dd hh:mm");
			}
			return val;
		}
	});
	
	app.filter('format_ch',function(){
		return function(val){
			val=val/1000;
			if(!!val){
				val = new Date(val).Format("yyyy年MM月dd");
			}
			return val;
		}
	});
}
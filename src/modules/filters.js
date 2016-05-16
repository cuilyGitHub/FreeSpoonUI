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

	app.filter('date',function(){
		return function(val){
			var date = new Date();
			if(!!val){
				date = Date.create(val);
			}
			return date.format('long', 'zh-CN');
		}
	});

}
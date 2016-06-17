module.exports = function(app){
	
	app.factory('bulksRes',function($resource){
		return $resource('http://yijiayinong.com/api/business/bulks/?:search',{search:'@search'});
	});
	
	app.factory('bulkRes',function($resource){
		return $resource('http://yijiayinong.com/api/business/bulks/1');
	});
				
	
}

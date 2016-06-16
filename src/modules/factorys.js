module.exports = function(app){
	
	app.factory('bulksRes',function($resource){
		return $resource('http://yijiayinong.com/api/business/bulks/');
	});
				
	/*
	app.factory('getResource',function(Resource){
		return {
			getRoot:function(){
				Resource.get({},function(){
					alert(data);
				},
				function(){
				});
			}
		}
	});
	*/
}

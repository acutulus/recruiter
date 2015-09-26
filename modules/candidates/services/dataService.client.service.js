angular.module('candidates')
.service('DataService',['$http', '$q',
	function($http, $q){

		var dataService = {};
		//cache will store objects keyed by:
		//1. list of items keyed by name of db
		//2. single item keyed by objectId
		//3. list of items keyed by name of db concat with query
		var cache = {};
		
		var inCache = function(objectType, condition, type){
			//no query or id, return full list of objects or nothing
			if(!condition){
				if(cache[objectType]){
					return cache[objectType];
				}else{
					return false;
				}				
			}
			//data is keyed by objectID
			else if(type === 'id'){
				if(cache[condition]){
					return cache[condition];
				}else{
					return false;
				}
			//data is keyed by objectType + query
			}else if(type === 'query'){
				var key = objectType + JSON.stringify(condition);
				if(cache[key]){
					return cache[key];
				}else{
					return false;
				}
			}
		}

		/**
		* @method add - http Post to server
		*/
		dataService.add = function(objectType, object) {
			var defer = $q.defer(); 
			var timer = new Date().getTime();

			$http.post('/' + objectType, object).success(function(data) {
				defer.resolve(data);
				var timeTaken = new Date().getTime() - timer;
				console.log('Post ' + objectType + ': ' + 'completed in:' + timeTaken);				

			}, function() {
				defer.reject();
			});
			
			return defer.promise;
		}

		/**
		* @method update
		*/
		dataService.update = function(objectType, object) {
			var defer = $q.defer();
			var timer = new Date().getTime();

			$http.put('/' + objectType, object).success(function(data){
				defer.resolve(data);
				var timeTaken = new Date().getTime() - timer;
				console.log('Update ' + objectType + ': ' + 'completed in:' + timeTaken);				

			}, function(){
				defer.reject();
			})

			return defer.promise;
		}

		/**
		* @method delete
		*/
		dataService.delete = function(objectType, object) {
			var defer = $q.defer();
			var timer = new Date().getTime();

			$http.delete('/' + objectType + '/' + object).success(function(data){
				defer.resolve(data)
				var timeTaken = new Date().getTime() - timer;
				console.log('Delete ' + objectType + ': ' + 'completed in:' + timeTaken);				
			}, function(){
				defer.reject();
			})

			return defer.promise;
		}

		/**
		* @method get - http get By ID
		* 
		*/
		dataService.get = function(objectType, objectId, useCache) {
			var timer = new Date().getTime();

			var defer = $q.defer();
			//check if specific objectId exists in cache
			if(useCache || useCache === undefined){
				var cacheData = inCache(objectType, objectId, 'id');
			}else{
				var cacheData = false;
			}
			if(cacheData){
				defer.resolve(cacheData);
				var timeTaken = new Date().getTime() - timer;
				console.log('Get '+ objectType + '- Data retrieved from cache in: ' + timeTaken);

			}else{
				$http.get('/' + objectType + '/' + objectId).success(function(data){
					defer.resolve(data);
					var timeTaken = new Date().getTime() - timer;
					console.log('Get '+ objectType +'/' + objectId + '- Data retrieved from HTTP in: ' + timeTaken);
					cache[objectId] = data;				
				}).error(function(){
					defer.reject();
					console.log('Get - Failed to retrieve data');
				});
			}
			return defer.promise;
		}

		/**
		* @method getQuery - http get by query
		*/
		dataService.getQuery = function(objectType, query, useCache) {
			var timer = new Date().getTime();

			var defer = $q.defer();
			if(useCache || useCache === undefined){
				var cacheData = inCache(objectType, query, 'query');
			}else{
				var cacheData = false;
			}
			if(cacheData){
				defer.resolve(cacheData);
				var timeTaken = new Date().getTime() - timer;
				console.log('GetQuery '+ objectType + ' - Data retrieved from cache in: ' + timeTaken);
			}else{
				var url = '/' + objectType;
				if(query){
					url += '/?query=' + JSON.stringify(query);
				}
				$http.get(url).success(function(data){
					defer.resolve(data);
					var timeTaken = new Date().getTime() - timer;
					console.log('GetQuery '+ url + '- Data retrieved with HTTP in: ' + timeTaken);
					if(query){
						var key = objectType + JSON.stringify(query);
						cache[key] = data;
					}else{
						cache[objectType] = data;
					}
				}).error(function(){
					console.log('GetQuery - Failed to getData')
					defer.reject();
				});
			}
			return defer.promise;	
		}



    /**
     * @method runCommand
     
    publicMembers.runCommand = function(method, cmd, data) {
			var timer = new Date().getTime();
      var defer = $q.defer();

      method = method.toLowerCase();
      if (method === 'get') {
				$http[method](cmd).success(function(data){
					defer.resolve(data);
				}, function(){
					defer.reject();
				})      	
      } else if (method === 'post' || method === 'put' || method === 'delete') {
				$http[method](cmd, data).success(function(data){
					defer.resolve(data);
				}, function(){
					defer.reject();
				})
      } else {
				defer.reject('invalid method ' + method);
				console.log('invalid method', method);
      }

			return defer.promise;
  	};*/  

	return dataService;

}
])
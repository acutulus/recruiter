'use strict';

angular.module('ats').controller('HomeScreenController', ['$scope','$location', 'Authentication','$timeout','$modal','DataService','$http',
	function($scope, $location, Authentication, $timeout,$modal,DataService,$http){
		$scope.authentication = Authentication.user;
		console.log($scope.authentication);
		//old user
		DataService.getQuery('clients', {organisation:$scope.authentication.organisation})
		.then(function(data){
			console.log('clients from server', data);
			if(data.length === 0){
				var modalInstance = $modal.open({
					templateUrl: '/modules/ats/modals/create-client.modal.html',
					controller:'CreateClientController',
					size:'med'
				})
				modalInstance.result.then(function(client){
					$scope.client = {name:client};
	    			$scope.client.organisation = $scope.authentication.organisation;
	    			DataService.add('clients', $scope.client)
	    			.then(function(res){
	    				$location.path('/homepage/client/' + res._id);
	    			})
				})	
			}else{
				$scope.clients = data;
				$scope.client = data[0];
				$location.path('/homepage/client/' + $scope.client._id); 
			}

		})
		/*if($scope.authentication.hasOwnProperty('organisation')){	
			DataService.get('organisations', $scope.authentication.organisation)
			.then(function(data){
				$scope.organisation = data;
			})
			$http.get('/clients/' + $scope.authentication.organisation)
			.then(function(data){
				$scope.clients = data;
			}, function(err){
				if(err){
					$scope.addClientMessage = true;
					$scope.addClientArrow = true;
				}
			})
		//new user
		}else{
	
		}*/
	}
])
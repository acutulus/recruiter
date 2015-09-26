'use strict';

angular.module('users').controller('RemoveClientCtrl', ['$scope', '$http', 'DataService',
	function($scope, $http, DataService){
		
		$scope.clients;
		$scope.deleteClient;
		$scope.confirmDelete = false;
		$scope.deleteSuccess = false;
		DataService.getQuery('clients').then(function(data){
			$scope.clients = data;
		});

		$scope.startDeleteClient = function(client){
			$scope.deleteClient = client;
			$scope.deleteSuccess = false;
			$scope.confirmDelete = true;
		}
		
		$scope.finishDeleteClient = function(){
			DataService.delete('clients', $scope.deleteClient).then(function(data){
				removeFromList();
				$scope.confirmDelete = false;
				$scope.deleteSuccess = true;
			})
		}

		var removeFromList = function(){
			for(var x in $scope.clients){
				if($scope.clients[x]._id === $scope.deleteClient._id){
					$scope.clients.splice(x,1);
				}
			}
		}
	}
])
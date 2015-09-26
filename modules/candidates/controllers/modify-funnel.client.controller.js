'use strict';

angular.module('candidates').controller('ModifyFunnelCtrl', ['$scope','DataService','$stateParams',
	function($scope, DataService, $stateParams){
		$scope.client;
		$scope.arrayFunnel;

		DataService.get('clients', $stateParams.clientId ).then(function(data){
			$scope.client = data;
			//check if client has funnel
			if($scope.client.funnel){
				$scope.arrayFunnel = parseFunnel($scope.client.funnel);
			}else{
				$scope.arrayFunnel = [];
			}
		});

		$scope.addNewItem = function(){
			if($scope.newItemName === '' || $scope.newItemName === 'add item...' || $scope.newItemName === 'need to enter a name'){
				$scope.newItemName = 'need to enter a name';
				return;
			}else{
				$scope.arrayFunnel.push($scope.newItemName);
				$scope.newItemName = '';
				$scope.client.funnel = $scope.arrayFunnel.toString();
				console.log($scope.client.funnel);
				DataService.update('clients/funnel', $scope.client).then(function(data){
					console.log(data);
				})
			}
		}

		$scope.removeItem = function(item){
			var index = $scope.arrayFunnel.indexOf(item);
			if(index > -1){
				$scope.arrayFunnel.splice(index, 1);
			}
			$scope.client.funnel = $scope.arrayFunnel.toString();
			DataService.update('clients/funnel', $scope.client).then(function(data){
				console.log(data);
			})
		}

		var parseFunnel = function(funnel){
			if(typeof funnel === 'string'){
				return funnel.split(",");
			}else{
				return['error']
			}
		}

	}
]);
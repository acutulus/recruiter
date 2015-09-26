'use strict';

angular.module('candidates')
	.controller('EditClientCtrl', 
		function($scope, $modalInstance, DataService, $timeout, client){
			$scope.client = client;
			//return funnel to array format
			if(typeof $scope.client.funnel === 'string'){
				$scope.client.funnel = $scope.client.funnel.split(',');
			}

			$scope.updateClient = function(){
				//add default funnel if needed
					if($scope.client.funnel.length === 1 && $scope.client.funnel[0] === ''){
						$scope.client.funnel[0] = 'Application Submitted';
					}else{
						$scope.client.funnel = buildFunnel();
					}
					//check necessary params
					if($scope.client.serviceUsed && $scope.client.name){
						console.log('SEDNING', $scope.client);
						DataService.update('admin/rest/clients/' + $scope.client._id, $scope.client).then(function(data){
							if(data){
								$scope.client.funnel = $scope.client.funnel.split(',');
								$scope.clientAdded = 'success';
								$modalInstance.close($scope.client);
							}
						})
					}else{
						$scope.clientAdded = 'field';
						return;
					}

			}
		$scope.removeItem = function(item){
			if($scope.client.funnel.length > 1){
				$scope.client.funnel.splice(item, 1);
			}else{
				$scope.client.funnel[item] = '';
			}
		}

		$scope.addItem = function(){
			$scope.client.funnel.push('');
		}

		var buildFunnel = function(){

			var stringFunnel = $scope.client.funnel[0];
			for(var i = 1; i < $scope.client.funnel.length; i++){
				stringFunnel += ',' + $scope.client.funnel[i];
			}

			return stringFunnel;
		}
	})
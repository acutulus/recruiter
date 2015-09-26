'use strict'

angular.module('users').controller('AddClientCtrl', ['$scope', 'Authentication', '$http', 'DataService', '$timeout', '$location',
	function($scope, Authentication, $http, DataService, $timeout, $location){
		$scope.authentication = Authentication;
		$scope.clientAdded;
		$scope.client = {};
		$scope.client.funnel = [''];
		
		
		$scope.newClient = function(){
			if($scope.authentication.user){
				//add default funnel if needed
				if($scope.client.funnel.length === 1 && $scope.client.funnel[0] === ''){
					$scope.client.funnel[0] = 'Application Submitted';
				}else{
					$scope.client.funnel = buildFunnel();
				}
				//check necessary params
				if($scope.client.serviceUsed && $scope.client.name){
					$scope.client.organisation = $scope.authentication.user.organisation;
					DataService.add('clients', $scope.client).then(function(data){
						if(data){
							$scope.clientAdded = 'success';
							$timeout(function(){
								$location.path('/app/clients/' + data._id);
							}, 1000);
						}
					})
				}else{
					$scope.clientAdded = 'field';
					return;
				}
			}else{		
				$scope.clientAdded = 'user';		
				return;
			}
		}

		$scope.results = 'none yet';

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
	}
]);
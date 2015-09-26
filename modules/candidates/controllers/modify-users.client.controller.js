'use strict';

angular.module('candidates')
.controller('ModifyUserCtrl', ['$scope','DataService', '$modal',
	function($scope,DataService, $modal){
		

		$scope.newUserModal = function(){
			var modalInstance = $modal.open({
				templateUrl: '/modules/candidates/views/invite-user-modal.html',
				controller: 'NewUserModalCtrl'
			})
		}
	}
])
//Controller for Invite-User Email Modal
.controller('NewUserModalCtrl', ['$scope', '$modalInstance','Authentication', 'DataService', '$timeout','$stateParams',
	function($scope, $modalInstance, Authentication, DataService, $timeout, $stateParams){

		$scope.user = Authentication.user;
		$scope.showRoles;

		//Modal called from client-details
		if($stateParams.clientId){
			$scope.showRoles = false;
			$scope.newUser = {
								client:$stateParams.clientId, 
								inviteFrom:'',
								role:'clientUser'};
			DataService.get('clients', $stateParams.clientId)	
				.then(function(data){
					$scope.newUser.inviteFrom = data.name;
				})

		//Modal called from add-user
		}else{
			$scope.showRoles = true;
			$scope.clients;
			$scope.newUser = {};
			$scope.selectedNames = {};
			//check if clientAdmin or orgAdmin
			if($scope.user.organisation){
				DataService.getQuery('clients', {organisation:$scope.user.organisation})
					.then(function(data){
						$scope.clients = data;
					});
				DataService.get('organisations', $scope.user.organisation)
					.then(function(data){
						$scope.organisation = data;
					})

			}else if($scope.user.client){
				DataService.get('clients', $scope.user.client)
					.then(function(data){
						$scope.clients = data;
					})
			}
			
			$scope.selectClient  = function(client){
				$scope.newUser.inviteFrom = client.name;
				$scope.newUser.client = client._id;
				$scope.selectedNames.client = client.name;
			}
			$scope.selectOrganisation = function(){
				$scope.newUser.inviteFrom = $scope.organisation.name;
				$scope.newUser.organisation = $scope.organisation._id;
			}
		}

		//general purpose 
		$scope.emailSent = false;
		$scope.emailFail = false;		

		$scope.close = function(){
			$modalInstance.close();
		}

		$scope.sendEmail = function(){

			//make sure fields arent empty
			if($scope.newUser.email && ($scope.newUser.client || $scope.newUser.organisation) && $scope.newUser.role){

				//make sure email is valid
				var reg = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
				
				if(reg.test($scope.newUser.email)){

					DataService.add('userrequests', $scope.newUser).then(function(user){
						$scope.emailSent = true;
						$scope.emailFail = false;
						$timeout($scope.close, 2000);
					});
				}else{
					$scope.emailSent = false;
					$scope.emailFail = true;
				}
			}else{
				$scope.emailSent = false;
				$scope.emailFail = true;
			}


		}
	}
]);
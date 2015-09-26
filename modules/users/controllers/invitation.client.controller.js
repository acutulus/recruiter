'use strict';

angular.module('users').controller('InvitationCtrl',['$scope', '$http', '$location', 'DataService','$stateParams','Authentication','$timeout',
	function($scope, $http, $location, DataService, $stateParams, Authentication, $timeout) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user){
			$scope.signedIn = true;			
			$timeout(function(){
				$location.path('/');
			},7000);
		}
		$scope.userData = {};
		//check if userrequest token is valid
		$scope.requestValid = false;
		$scope.requestInvalid = true;
		$scope.requestSuccess = false;

		//check that form filled correctly
		$scope.formIncomplete = false
		
		//get userrequest data for :_id, check valid field 
		DataService.get('userrequests', $stateParams.accessToken).then(function(data){
			if(data){
				$scope.requestValid = data.userrequest.valid;
				$scope.requestInvalid = !data.userrequest.valid
				$scope.requestInformation = data.userrequest;
				
				//get hidden userData from userrequest
				$scope.userData.role = $scope.requestInformation.roles;
				$scope.userData.email = $scope.requestInformation.email;
				if($scope.requestInformation.client){$scope.userData.client = $scope.requestInformation.client};
				if($scope.requestInformation.organisation){$scope.userData.organisation = $scope.requestInformation.organisation}
			}else{
				$scope.requestInvalid = true;
				$scope.requestValid = false;
			}
		});



		//send userData and userrequest._id to the server. If userrequest._id is not valid
		//will reject all 
		$scope.submit = function(){
			if(!($scope.userForm.$valid)){
				return;
			}
			if($scope.userData.password === $scope.confirmPassword){
				DataService.add('userrequests/' + $scope.requestInformation._id +'/signup', $scope.userData).then(function(data){
					if(data){
						$scope.requestSuccess = true;
						$scope.requestValid = false;
						$timeout(function(){$location.path('/#!/signin');},2000);
					}else{
						console.log('erororor')
					}		
				})
			}
		}	
	}
]);
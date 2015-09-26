'use strict';

angular.module('authorize').controller('SignInController', ['$scope', '$http', '$location', 'Authentication','$timeout','$modal',
	function($scope, $http, $location, Authentication, $timeout){
		$scope.user = Authentication.user;
		$scope.login = {};
		$scope.signin = function() {

			$http.post('/auth/signin', $scope.login).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.signedIn = true;
				$timeout(function(){
					$scope.user=response;
					location.href ='/management.html#!/home/' + user.organisation//route to app
				},2000)
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

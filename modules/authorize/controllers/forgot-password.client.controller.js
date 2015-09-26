'use strict';

angular.module('authorize').controller('ForgotPasswordController', ['$scope', '$http', '$location', 'Authentication','$timeout',
	function($scope, $http, $location, Authentication, $timeout){
		$scope.user = Authentication.user;
		if($scope.user){
			$scope.signedIn = true;
		}
		$scope.retrievePassword = function(){
			$http.post('/auth/forgot', $scope.forgot).then(function(data){
				console.log(data);
			}, function(err){
				console.log(err);
			})
		}
	}
]);
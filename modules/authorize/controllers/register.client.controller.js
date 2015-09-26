'use strict';

angular.module('authorize').controller('RegisterController', ['$scope', '$http', '$location', 'Authentication','$timeout',
	function($scope, $http, $location, Authentication, $timeout){
		$scope.user = Authentication.user;
		$scope.newUser = {};
		$scope.register = function(){
			if($scope.registerForm.$valid){

				if($scope.newUser.password === $scope.rePassword){

					if(!($scope.newUser.password.length < 7)){

						$http.post('/organisations', {name:$scope.newUser.email})
						.then(function(res){
							$scope.newUser.organisation = res.data._id;
							$http.post('/auth/signup', $scope.newUser).then(function(resp){
								console.log(resp)
								$scope.msgs = {};
								$scope.msgs.created = true;
								$timeout(function(){
									location.href = '/management.html#!/homepage'
								},1000);
								
							},function(err){
								if(err.data.message.slice(0,6) === 'E11000'){
									return $scope.emailUsed;
								}
								console.log('ERR', err);
							});
						}, function(err){
							alert(err);
						})

					}else{
						$scope.msgs ={};
						return $scope.msgs.passwordShort = true;
					}
				}else{
					$scope.msgs = {};
					return $scope.msgs.passwordsDontMatch = true;
				}
			}else{
				$scope.msgs = {};
				return $scope.msgs.formError = true;
			}
		}
	}
])

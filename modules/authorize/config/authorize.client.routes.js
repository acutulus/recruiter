'use strict';

// Setting up route
angular.module('authorize').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/login')
		$stateProvider
		.state('signin',{
			url:"/login",
			templateUrl:"modules/authorize/views/signin.html"
		})
		.state('register',{
			url:"/register",
			templateUrl:"modules/authorize/views/register.html"
		})
		.state('forgot-password',{
			url:"/forgot-password",
			templateUrl:"modules/authorize/views/forgot-password.html"
		})
	}
])
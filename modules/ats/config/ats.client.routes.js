'use strict';

// Setting up route
angular.module('ats').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/homepage')
		$stateProvider
		.state('home',{
			url:'/homepage',
			templateUrl:"modules/ats/views/home-screen.html"
		})
		.state('home.addClient',{
			url:'/add-client',
			templateUrl:"modules/ats/views/add-client.html"
		})
		.state('home.client',{
			url:'/client/:client',
			templateUrl:"modules/ats/views/client-home.html"
		})
		.state('home.addJob',{
			url:'/add-job/:client',
			templateUrl:"modules/ats/views/add-job.html"
		})
	}
])
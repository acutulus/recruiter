'use strict';

angular.module('ats').controller('ClientHomeController', ['$scope','$location', 'Authentication','$timeout','$modal','DataService','$stateParams',
	function($scope, $location, Authentication, $timeout,$modal,DataService,$stateParams){
		
		DataService.get('clients', $stateParams.client)
		.then(function(client){
			$scope.client = client;
		})
		DataService.getQuery('jobs/client', {client:$stateParams.client})
		.then(function(jobs){
			$scope.jobs = jobs;
			console.log(jobs);
		})
	}
]);
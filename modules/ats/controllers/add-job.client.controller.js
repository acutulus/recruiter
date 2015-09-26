'use strict';

angular.module('ats').controller('AddJobController', ['$scope','$location', 'Authentication','$timeout','$modal','DataService','$stateParams',
	function($scope, $location, Authentication, $timeout,$modal,DataService,$stateParams){
		DataService.get('clients', $stateParams.client)
		.then(function(client){
			$scope.client = client;
		});

		$scope.job = {};
		$scope.jobModel = {
			title:{
				type:'string'
			},
			code: {
				type: 'string'
			},
			location:{
				type:'address'
			},
			full_description: {
				type: 'html'
			},
			description: {
				type: 'string'
			},
			employment_type:{
				type:'string'
			},
			experience: {
				type: 'string'
			},
			education: {
				type: 'string'
			},			
			keywords: [{
				keyword:{
					type: 'string'
				}
			}]
		}
	}
])
		
'use strict';

angular.module('candidates').controller('CandidateCtrl', ['$scope', '$http', '$stateParams', 'Authentication', 'DataService','$window',
	function($scope, $http, $stateParams, Authentication, DataService, $window){
		$scope.authentication = Authentication;
		$scope.jobListView = false;
		//functions for URL check, update view to reflect url ID's
		var checkUrlClients = function(){
			if($stateParams){
				for(var x in $scope.clients){
					if($scope.clients[x]._id === $stateParams.clientId){
						$scope.activeClient = $scope.clients[x];
						getJobs();
					}
				}
			}
		}
		var checkUrlJobs = function(){
			if($stateParams){
					for(var x in $scope.jobs){
					if($scope.jobs[x]._id === $stateParams.jobId){
						$scope.activeJob = $scope.jobs[x];
					}
				}
			}
		}
		//get clients for org user or client for clientuser
		var getClients = function(){
			//if($scope.userAccess === 'recruiterAdmin' || $scope.userAccess === 'recruiterUser'){
			DataService.getQuery('clients', {organisation:$scope.organisation._id}, false)
			.then(function(data){
				$scope.clients = data;
				checkUrlClients();
			})
		}

		/*$scope Variables for view updating*/
		$scope.organisation;
		$scope.clients;
		$scope.activeClient;
		$scope.activeJob;
		$scope.jobs;		

		if($stateParams.organisationId){
			DataService.get('organisations', $stateParams.organisationId)
			.then(function(data){
				$scope.organisation = data;
				getClients();
			})
		}else if ($scope.authentication.user !== null){
			//get user permissions
			$scope.userAccess = $scope.authentication.user.role;
			if($scope.authentication.user.organisation === 'undefined'){
				alert('No organisation found for user');
			}

				DataService.get('organisations', $scope.authentication.user.organisation)
				.then(function(data){
					$scope.organisation = data;
					getClients();
				});
		}

		var getJobs = function(){
			DataService.getQuery('jobs/client', {client:$scope.activeClient._id})
			.then(function(data,status){
				$scope.jobs = data;		
				checkUrlJobs();
			})
		}
		$scope.selectClient = function(client){
			$scope.activeClient = client;
			getJobs();
			
			$scope.jobListView = true;
		}
		$scope.selectJob = function(job){
			$scope.activeJob = job;

		}
		$scope.refreshJobs = function(){
			if(typeof $scope.activeClient === 'object'){
				DataService.getQuery('clients/pullallclients' , false,false)
					.then(function(data){
						DataService.getQuery('jobs/client', {client:$scope.activeClient._id}, false)
									.then(function(data,status){
										$scope.jobs = data;
									})
					})
			}else{
				console.log('error client: ' + typeof $scope.activeClient);
			}
		}


	}
])
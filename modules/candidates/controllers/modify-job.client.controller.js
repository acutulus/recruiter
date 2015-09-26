'use strict';

angular.module('candidates').controller('ModifyJobCtrl', ['$scope','DataService','$stateParams','$location', '$timeout',
	function($scope, DataService, $stateParams, $location, $timeout){
		if($stateParams.hasOwnProperty('clientId')){
			DataService.get('clients', $stateParams.clientId)
			.then(function(clientData){
				$scope.addJobClient = clientData;
			})
		}

		$scope.newJob = {};
		$scope.jobAdded = false;
		$scope.codes = [];
		if($stateParams.jobId){
			DataService.get('jobs', $stateParams.jobId).then(function(data){
				$scope.newJob = data;
					DataService.get('client', $scope.newJob.client)
					.then(function(clientData){
						$scope.addJobClient = clientData;
					})
			});
		};

		$scope.updateJob = function(){
			DataService.update('jobs/' + $stateParams.jobId , $scope.newJob).then(function(data){
				console.log(data);
				$scope.jobAdded = true;
					$timeout(function(){
						$location.path('/app/clients/' + $scope.addJobClient._id);
					})
			})
		};

		$scope.addJob = function(){
			$scope.newJob.client = $scope.addJobClient._id;
			DataService.getQuery('jobs/client',{applicantpro_job_id: $scope.newJob.applicantpro_job_id, client: $scope.newJob.client})
			.then(function(data){
				if(data.length > 0){
					$scope.jobCodeUsed = {code: data[0].applicantpro_job_id, name: data[0].title};
					$timeout(function(){
						$scope.jobCodeUsed = false;
					}, 5000);
				}else{
					DataService.add('jobs', $scope.newJob).then(function(data){
						console.log(data);
						$scope.jobAdded = true;
						$timeout(function(){
							$location.path('/app/clients/' + $scope.addJobClient._id);
						}, 1000);
					});
				}
			});
		};

	}
]);
'use strict';

angular.module('candidates').controller('CandidateShareCtrl', ['$scope','$stateParams', '$http', 'DataService',
	function($scope, $stateParams, $http, DataService){
		$scope.candidate;

		DataService.getQuery('candidates/' + $stateParams.candidateId).then(function(data,status){
			console.log(data)
			$scope.candidate = data;
		})
	}
]);

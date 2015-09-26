'use strict';

angular.module('candidates').controller('CandidateListCtrl', ['$scope', '$stateParams','$timeout','DataService',
	function($scope, $stateParams, $timeout, DataService){

		$scope.jobs;
		$scope.candidates = {};
		$scope.jobId = $stateParams.jobId;	
		console.log($scope.jobId);
		$scope.clientId = $stateParams.clientId
		$scope.client;
		$scope.qualifiedList = true;
		$scope.candidateListInfo = 'Getting Candidates...';

		
		//holds the current part of funnel being examined
		$scope.candidates.candidateFunnel;
		$scope.candidates.disqualifiedFunnel;
		var firstRun = true;
		//get candidates for job, break into qualified and unqualified object
		//{funnelName:[candidates],funnelName2:[candidates]}
		$scope.getCurrent = function(){
			$scope.candidates.disqualifiedCandidates = {};
			$scope.candidates.qualifiedCandidates = {};
			var current;
			if(firstRun){
				firstRun = false;
				return;
			}
			if($scope.candidates.allCandidates.length === 0){
				$scope.candidateListInfo = 'No candidates found for job.';
				//$scope.candidates.qualifiedCandidates[$scope.client.funnel[0]] = [{name:'No Candidates For This Job'}];
			}
			else{
				$scope.candidateListInfo = 'Sort List';
				for(var x in $scope.candidates.allCandidates){
					//check if candidate is in our funnel
					if($scope.client.funnel.indexOf($scope.candidates.allCandidates[x].stage) < 0){ 
						$scope.candidates.allCandidates[x].stage = $scope.client.funnel[0];
					}
					//build qualified and disqualified candidates objects
					if($scope.candidates.allCandidates[x].disqualified === true){
						if($scope.candidates.disqualifiedCandidates[$scope.candidates.allCandidates[x].stage]){
							$scope.candidates.disqualifiedCandidates[$scope.candidates.allCandidates[x].stage].push($scope.candidates.allCandidates[x]);
						}else{
							$scope.candidates.disqualifiedCandidates[$scope.candidates.allCandidates[x].stage] = [];
							$scope.candidates.disqualifiedCandidates[$scope.candidates.allCandidates[x].stage].push($scope.candidates.allCandidates[x]);

						}
					}else{
						//if stage already in qualified object
						if($scope.candidates.qualifiedCandidates[$scope.candidates.allCandidates[x].stage]){
							$scope.candidates.qualifiedCandidates[$scope.candidates.allCandidates[x].stage].push($scope.candidates.allCandidates[x]);
						//else add stage 
						}else{
							$scope.candidates.qualifiedCandidates[$scope.candidates.allCandidates[x].stage] = [];
							$scope.candidates.qualifiedCandidates[$scope.candidates.allCandidates[x].stage].push($scope.candidates.allCandidates[x]);
						}
						//resolve errors, ideally this never gets called
					}	
				}
			}
			//default to client.funnel[0]
			$scope.candidates.candidateFunnel = $scope.candidates.qualifiedCandidates[$scope.client.funnel[0]];
			$scope.candidates.disqualifiedFunnel = $scope.candidates.disqualifiedCandidates[$scope.client.funnel[0]];
			$scope.activeList = $scope.client.funnel[0];
		};

		//swap views with topbar nav
		$scope.switchCandidateList = function(list){
			$scope.activeList = list;
			$scope.candidates.candidateFunnel = $scope.candidates.qualifiedCandidates[list] ? $scope.candidates.qualifiedCandidates[list] : [];
			$scope.candidates.disqualifiedFunnel = ($scope.candidates.disqualifiedCandidates[list]) ? $scope.candidates.disqualifiedCandidates[list] : [];
		};

		$scope.sortLastAsc = function(){
			$scope.candidates.candidateFunnel.sort(function(a,b){
				if(a.lastname.toLowerCase()<b.lastname.toLowerCase())return -1;
				if(a.lastname.toLowerCase()>b.lastname.toLowerCase())return 1;
				return 0;
			});
		}
		$scope.sortLastDesc = function(){
			$scope.candidates.candidateFunnel.sort(function(a,b){
				if(a.lastname.toLowerCase()>b.lastname.toLowerCase())return -1;
				if(a.lastname.toLowerCase()<b.lastname.toLowerCase())return 1;
				return 0;
			});
		}
		$scope.sortFirstAsc = function(){
			$scope.candidates.candidateFunnel.sort(function(a,b){
				if(a.firstname.toLowerCase()<b.firstname.toLowerCase())return -1;
				if(a.firstname.toLowerCase()>b.firstname.toLowerCase())return 1;
				return 0;
			})
		}
		$scope.sortFirstDesc = function(){
			$scope.candidates.candidateFunnel.sort(function(a,b){
				if(a.firstname.toLowerCase() > b.firstname.toLowerCase())return -1;
				if(a.firstname.toLowerCase() < b.firstname.toLowerCase()) return 1;
				return 0;
			})
		}

		console.log($stateParams.jobId)
		DataService.getQuery('candidates', {job:$stateParams.jobId}).then(function(data, success){
			$scope.candidates.allCandidates = data;
			$scope.getCurrent()
		});

		DataService.getQuery('clients/' + $scope.clientId)
			.then(function(data){
				$scope.client = data;
				if(typeof $scope.client.funnel === 'string'){
					$scope.client.funnel = $scope.client.funnel.split(',');
				}
				$scope.getCurrent();
		});

		/*### Listeners for Emit Events From Child: candidate-details.js ###*/
		$scope.$on('candidateDisqualified',function(cand, data){
			for(var x in $scope.candidates.allCandidates){
				if($scope.candidates.allCandidates[x]._id === data){
					$scope.candidates.allCandidates[x].disqualified = true;
					break;
				}
			}
			$scope.getCurrent();
		});

		$scope.$on('candidateAdvanced', function(cand, data){
			for(var x in $scope.candidates.allCandidates){
				if($scope.candidates.allCandidates[x]._id === data._id){
					$scope.candidates.allCandidates[x].stage = data.stage;
				}
			}
			$scope.getCurrent();
		});

		$scope.$on('candidateMoved', function(cand, data){
			for(var x in $scope.candidates.allCandidates){
				if($scope.candidates.allCandidates[x]._id === data._id){
					$scope.candidates.allCandidates[x].stage = data.stage;
				}
			}
			$scope.getCurrent();			
		});

		$scope.$on('candidateRequalified', function(cand,data){
			for(var x in $scope.candidates.allCandidates){
				if($scope.candidates.allCandidates[x]._id === data){
					$scope.candidates.allCandidates[x].disqualified = false;
					break;
				}
			}
			$scope.getCurrent();
		});
	}
])
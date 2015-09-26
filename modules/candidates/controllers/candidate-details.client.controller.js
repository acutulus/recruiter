'use strict';

angular.module('candidates').controller('CandidateDetailsCtrl', ['$scope','$stateParams', '$modal', '$location','DataService','Authentication',
	function($scope, $stateParams, $modal, $location, DataService, Authentication){

		$scope.user = Authentication.user;
		$scope.candidate;
		$scope.candidateId = $stateParams.candidateId
		$scope.clientId = $stateParams.clientId;
		var jobId = $stateParams.jobId;
		console.log('JOB ID'+jobId)
		$scope.client;
		$scope.stages;
		$scope.eventLog = false;
		var pageLoaded = 0;//tracks server reqs to know when to log pageview

		DataService.get('candidates', $scope.candidateId).then(function(data){
			$scope.candidate = data;
			if(typeof $scope.stages === 'object'){
				if($scope.stages.indexOf($scope.candidate.stage) < 0){
					$scope.candidate.stage = $scope.stages[0];
					$scope.candidate.showEvents = true;
					$scope.candidate.showData = true;
				}
			}
			(pageLoaded === 2)? logEvents('Candidate Viewed') : pageLoaded++;

		})
		DataService.get('clients', $scope.clientId).then(function(data){
			$scope.client = data;
			$scope.stages = $scope.client.funnel.split(",");
			if(typeof $scope.candidate === 'object'){
				if($scope.stages.indexOf($scope.candidate.stage) < 0){
					$scope.candidate.stage = $scope.stages[0];
				}
			}
			(pageLoaded === 2)? logEvents('Candidate Viewed') : pageLoaded++;

		})
		DataService.getQuery('events', {candidate:$scope.candidateId}).then(function(data){
			$scope.events = data;
			$scope.userComments = [];
			(pageLoaded === 2)? logEvents('Candidate Viewed') : pageLoaded++;

			for(var i=0,len=$scope.events.length; i < $scope.events.length; i++){
				$scope.events[i].time = new Date($scope.events[i]._updatedAt);
				$scope.events[i].time = $scope.events[i].time.getMonth() + '-' + 
										$scope.events[i].time.getDay() + '-' + $scope.events[i].time.getFullYear() + 
										' ' + $scope.events[i].time.getHours() + ':' + $scope.events[i].time.getMinutes();
				if($scope.userComments.indexOf($scope.events[i].user) > -1){

				}else{
					$scope.userComments.push($scope.events[i].user);
				}
			}
			console.log('EVENT READ RET', $scope.userComments);

			DataService.getQuery('users/comments', {users:$scope.userComments}).then(function(data){
				$scope.userComments = data;
			})
		})

		//disqualify candidate
		$scope.disqualify = function(){
			$scope.eventLog = 'disqualify';

			$scope.candidate.disqualified = true;
			DataService.update('candidates/' + $scope.candidate._id + '/disqualify')
					   .then(function(data, status){

					   })
			$scope.$emit('candidateDisqualified', $scope.candidate._id);
		}
		//advance candidate
		//once datapull works can remove error checking
		/*$scope.advance = function(){
			var advanced = false;
			var oldIndex = $scope.stages.indexOf($scope.candidate.stage);	
			
			if(oldIndex > -1){
				newIndex = (newIndex === $scope.stages.length - 1) ? newIndex : newIndex + 1;
			}
			
			if(oldIndex < newIndex){
				console.log('newdex' + newIndex);
				$scope.candidate.stage = $scope.stages[newIndex];
				advanced = true;

				DataService.update('candidates/' + $scope.candidate._id +'/stage', {stage:$scope.candidate.stage})
					.then(function(data, status){
						//update candidate-list view
						$scope.$emit('candidateAdvanced', {_id:$scope.candidate._id,stage:$scope.candidate.stage});
					});
			}else{
				advanced = true;
			}

			if(!advanced){
				$scope.candidate.stage = $scope.stages[0];
				DataService.update('candidates/' + $scope.candidate._id +'/stage', {stage:$scope.candidate.stage})
					.then(function(data, status){
						//update candidate-list view
						$scope.$emit('candidateAdvanced', {_id:$scope.candidate._id,stage:$scope.candidate.stage});
					});
			}		
		}*/

		$scope.move = function(stage){
			if($scope.candidate.stage === stage) return;
			if($scope.stages.indexOf(stage) > -1){
				$scope.candidate.stage = stage;
				DataService.update('candidates/' + $scope.candidate._id +'/stage', {stage:$scope.candidate.stage})
					.then(function(data, status){
						console.log(data);
					})
			}
			//update candidate-list view
			$scope.$emit('candidateMoved', {_id:$scope.candidate._id, stage:$scope.candidate.stage});
			$scope.eventLog = stage;
		}

		$scope.requalify = function(){
			$scope.candidate.disqualified = false;
			DataService.update('candidates/' + $scope.candidate._id +'/requalify')
					   .then(function(data, status){

					   })
			//update candidate-list view
			$scope.$emit('candidateRequalified', $scope.candidate._id)
			$scope.eventLog = 'requalify';
		}
		
		$scope.shareCandidate = function(){
			var modalInstance = $modal.open({
				templateUrl: '/modules/candidates/views/share-url-modal.html',
				controller: 'CandidateShareModalCtrl',
				size: 'med',
				resolve:{
					CandidateUrl: function(){
						return  $location.host() + ':' + $location.port() + "/#!/share/candidates/" + $scope.candidateId;
					}
				}
			})
		}

		$scope.displayResumePDF = function(candidate){
			console.log(candidate.resume_file)
		}



		//TEST DELETE WHEN DONE
		$scope.testNewCandidateEmail = function(){
			console.log($scope.testEmailAddress);
			DataService.add('candidates/' + $scope.candidateId+'/testEmailRoute/' + jobId,{email:$scope.testEmailAddress})
				.then(function(data){
					console.log(data);
				})
		}

		$scope.logEvents = function(eventType){
	
			var newEvent = { candidate:$scope.candidate._id, 
			 			 	 user:$scope.user._id,
			  			 	 description: $scope.eventDescription,
			  			 	 name: eventType || $scope.eventLog	
			  				}
			DataService.add('events', newEvent)
				.then(function(res){
					$scope.eventDescription = '';
					$scope.eventLog = false;	
					$scope.describeEvent = false;
					res.time = new Date(res._updatedAt);
					res.time = res.time.getMonth() + '-' + res.time.getDay() + '-' + res.time.getFullYear() + 
								' ' + res.time.getHours() + ':' + res.time.getMinutes();
					$scope.events.push(res);
					if($scope.userComments[res.user]){
					}else{
						DataService.getQuery('users/comments',{users:[res.user]}).then(function(data){
							$scope.userComments.push(data[0]);
						})
					}
				});
		}
	}
])
//controller for share modal
.controller('CandidateShareModalCtrl', ['$scope', '$modalInstance', 'CandidateUrl',
	function($scope, $modalInstance, CandidateUrl){
		$scope.candidateUrl = CandidateUrl
		$scope.close = function(){
			$modalInstance.close();
		}
	}
]);
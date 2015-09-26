'use strict';

angular.module('candidates')
.controller('ClientDetailsCtrl', ['$scope','$stateParams', 'DataService', '$modal', '$location','$timeout',
	function($scope, $stateParams, DataService, $modal, $location, $timeout){

		$scope.jobsView = true;
		
		$scope.newUserModal = function(){
			var modalInstance = $modal.open({
				templateUrl: '/modules/candidates/views/invite-user-modal.html',
				controller: 'NewUserModalCtrl'
			})
		}
		
		$scope.loadClientData = function(reload){
			$scope.funnelView = false;
			$scope.client;
			$scope.arrayFunnel;

			if(reload){
				DataService.get('clients', $stateParams.clientId, false).then(function(data){
					$scope.client = data;
					//check if client has funnel
					if($scope.client.funnel){
						$scope.arrayFunnel = parseFunnel($scope.client.funnel);
					}else{
						$scope.arrayFunnel = [];
					}
					$scope.getClientJobs();
				});
			}else{
				DataService.get('clients', $stateParams.clientId ).then(function(data){
					$scope.client = data;
					//check if client has funnel
					if($scope.client.funnel){
						$scope.arrayFunnel = parseFunnel($scope.client.funnel);
					}else{
						$scope.arrayFunnel = [];
					}
							console.log($scope.client)

					$scope.getClientJobs();
				});
			}
		}

		$scope.getClientJobs = function(){
			DataService.getQuery('jobs/client', {client:$scope.client._id}, false)
				.then(function(data,status){
					$scope.jobs = data;		
				});
		}
		
		//#### FUNNEL FUNCTIONS ####
		$scope.addNewItem = function(){
			if($scope.newItemName === '' || $scope.newItemName === 'add item...' || $scope.newItemName === 'need to enter a name'){
				$scope.newItemName = 'need to enter a name';
				return;
			}else{
				$scope.arrayFunnel.push($scope.newItemName);
				$scope.newItemName = '';
				$scope.client.funnel = $scope.arrayFunnel.toString();
				console.log($scope.client.funnel);
				DataService.update('clients/funnel', $scope.client).then(function(data){
					console.log(data);
					
				})
			}
		}
		$scope.removeItem = function(item){
			var index = $scope.arrayFunnel.indexOf(item);
			if(index > -1){
				$scope.arrayFunnel.splice(index, 1);
			}
			$scope.client.funnel = $scope.arrayFunnel.toString();
			DataService.update('clients/funnel', $scope.client).then(function(data){
				console.log(data);
			})
		}
		var parseFunnel = function(funnel){
			if(typeof funnel === 'string'){
				return funnel.split(",");
			}else if(funnel.constructor === Array){
				return funnel;
			}else{	
				return['error']
			}
		}
		$scope.postCSVFile = function(element){
			$scope.csvResponseText = 'Posting CSV...';
			$scope.$apply();
			var file = document.getElementById('csvfile');
			var formdata = new FormData();
			if(!file.files[0]){
				return alert('no csv file uploaded');
			}
			if(file.files[0].type === 'text/csv'){
				formdata.append('file', file.files[0]);
				formdata.append('client', JSON.stringify($scope.client));
				var request = new XMLHttpRequest();
				request.onreadystatechange = function(){
					if(request.readyState === 4){
						var res = JSON.parse(request.responseText)
						$scope.csvResponseText = 'Checked :' + (res.jobNotFound + res.newCandidate + res.oldCandidate) + ' candidates. ' ;
						$scope.csvResponseText += res.newCandidate + ' new candidates added. ';
						$scope.csvResponseText += res.oldCandidate + ' old candidates updated. ';
						$scope.csvResponseText += res.jobNotFound + ' candidates applied to jobs not in our system.'
						$scope.$apply();

						$timeout(function(){
							$scope.csvResponseText = false;
						}, 10000);
					}
				}
				request.open('POST', '/organisations/csv/upload', true);
				request.send(formdata);
			}else{
				return alert('thats not a csv file bro');
			}

		}

		$scope.deleteJob = function(id, removeIndex){

			DataService.delete('jobs', id)
			.then(function(data){
				$scope.jobs.splice(removeIndex,1);
			})

		}

		$scope.editClientData = function(){
			var modalInstance = $modal.open({
				templateUrl: '/modules/candidates/views/edit.client.modal.html',
				controller:'EditClientCtrl',
				size:'med',
				resolve:{
					client:function(){
						return $scope.client;
					}
				}
			})
			modalInstance.result.then(function(client){
				$scope.loadClientData(true);
			})
		}

		$scope.removeClient = function(){
			if($scope.removeClientConfirmText === 'yes'){
				DataService.delete('clients', $scope.client._id)
				.then(function(data){
					if(data){
						$scope.removeClientReturnData = data;
						$scope.removeClientCompleted = true;
						$scope.removeClientCheck = false;
						$timeout(function(){
							$location.path('/app/organisation/' + $scope.client.organisation)
						},3000);
					}
				})
			}else{
				$scope.removeClientTextWrong = true;

			}
		}

		$scope.loadClientData(false);

	}
])
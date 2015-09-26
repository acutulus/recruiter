'use strict';

// Setting up route
angular.module('candidates').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('recruiter', {
			url:"/app",
			templateUrl:'modules/candidates/views/candidate-tool.html'		
		})
		.state('recruiter.organisation',{
			url:"/organisation/:organisationId",
			templateUrl:'modules/candidates/views/organisation-details.html'
		})
		.state('recruiter.client',{
			url:"/clients/:clientId",
			templateUrl:"modules/candidates/views/client-details.html"
		})
		.state('recruiter.job', {
			url:"/clients/:clientId/jobs/:jobId",
			templateUrl: 'modules/candidates/views/candidate-list.html'	
		})
		.state('recruiter.job.candidate', {
			url:"/candidates/:candidateId",
			templateUrl: 'modules/candidates/views/candidate-details.html'
		})
		.state('share',{
			url:"/share/candidates/:candidateId",
			templateUrl:'modules/candidates/views/candidate-share.html'
		})
		.state('recruiter.new-client',{
			url:'/client/add',
			templateUrl:'modules/candidates/views/add-client.html'
		})
		.state('recruiter.remove-client', {
			url:'/client/remove',
			templateUrl:'modules/candidates/views/remove-client.html'
		})
		.state('recruiter.modify-funnel', {
			url:'/funnel/:clientId',
			templateUrl:'modules/candidates/views/modify-funnel.html'
		})
		.state('recruiter.modify-job',{
			url:'/modify/job/:jobId',
			templateUrl:'modules/candidates/views/modify-job.html'
		})
		.state('recruiter.add-job',{
			url:'/add/job/:clientId',
			templateUrl:'modules/candidates/views/add-job.html'
		})
		.state('recruiter.modify-users',{
			url:'/users/:organisationId',
			templateUrl:'modules/candidates/views/modify-users.html'
		})

		$urlRouterProvider.otherwise('/app');
	}
]);
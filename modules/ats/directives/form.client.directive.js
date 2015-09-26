angular.module('ats')
	.directive('kepsForm',['DataService','$stateParams',
		function(DataService, $stateParams){
			return {
				restrict: 'E',
				
				templateUrl:'/admin/modules/editor/templates/formTemplate.html',

				scope: {
					kepsData:'=',
					kepsModel:'=',
					kepsFramework:'='
				},
				link:function(scope, element, attrs){
					scope.data = {};
		        	if (scope.kepsModel) {
		          		scope.data.value = scope.kepsModel;
		        	}

		        	scope.$watch('data.value', function(newVal) {
		          	if (typeof newVal !== 'undefined') {
			          	//console.log('change', scope.kepsName, newVal);
		            	scope.kepsModel = newVal; 
		          	}
		        	});
				}
			}
		}
	]);
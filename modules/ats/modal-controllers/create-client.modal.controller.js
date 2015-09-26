'use strict';

angular.module('ats').controller('CreateClientController', 
	function($scope, $modalInstance, $http, $timeout){
	 	$scope.cancel = function () {
	      $modalInstance.dismiss('cancel');
	    };

	    $scope.submit = function(){
			$scope.success = true;
			$timeout(function(){
    			$modalInstance.close($scope.business)
    		},1000);
	    }
	}
)
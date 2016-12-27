'use strict';

/**
 * @ngdoc function
 * @name demoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the demoApp
 */
angular.module('demoApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    
    $scope.addElement = function(element) {
    	console.log(element);
    };
  }]);

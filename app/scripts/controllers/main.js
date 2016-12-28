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

  	$scope.canvas = document.getElementById('myCanvas');
  	$scope.canvasWidth = $scope.canvas.clientWidth - 5;
  	$scope.canvasHeight = $scope.canvas.clientHeight - 5;

  	$scope.svg = d3.select('#myCanvas')
  	.append('svg')
  	.attr('width', $scope.canvasWidth)
  	.attr('height', $scope.canvasHeight);

  }]);

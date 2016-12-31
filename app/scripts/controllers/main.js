'use strict';

/**
 * @ngdoc function
 * @name demoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the demoApp
 */
 angular.module('demoApp')
 .controller('MainCtrl', ['$scope', 'mainSvc', function ($scope, mainSvc) {

  	$scope.canvas = document.getElementById('myCanvas');
  	$scope.canvasWidth = $scope.canvas.clientWidth - 5;
  	$scope.canvasHeight = $scope.canvas.clientHeight - 5;

  	$scope.svg = d3.select('#myCanvas')
  	.append('svg')
  	.attr('width', $scope.canvasWidth)
  	.attr('height', $scope.canvasHeight);

  	$(document).ready(function() {
  		var storage = mainSvc.init();
	 	if(storage.length) {
	 		angular.forEach(storage, function(item) {
	 			switch(item.name) {
	 				case 'line' : $scope.createLine(item); break;
	 				case 'circle' : $scope.createCircle(item); break;
	 				case 'rectangle' : $scope.createRectangle(item); break;
	 				case 'square': $scope.createSquare(item); break;
	 			}
	 		});
	 	}
  	});
  }]);

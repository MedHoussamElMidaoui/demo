'use strict';

angular.module('demoApp').factory('mainSvc', function() {
	var serviceInstance = {
		init: function() {
			return {};
		},

		Line: function lineConstruct(width, height){
          this.name = 'line';
          this.point1 = {
          	x : Math.floor(Math.random() * width),
          	y : Math.floor(Math.random() * height)
          };
          this.point2 = {
          	x : Math.floor(Math.random() * width),
          	y : Math.floor(Math.random() * height)
          };
        }

	};

	return serviceInstance;
});
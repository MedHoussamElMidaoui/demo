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
        },

        Rectangle: function rectangleConstruct(width, height){
        	this.namr = 'rectangle';
        	this.point = {
        		x : Math.floor(Math.random() * width),
          		y : Math.floor(Math.random() * height)
        	};
        	this.width = Math.floor(Math.random() * (width - this.point.x));
        	this.height = Math.floor(Math.random() * (height - this.point.y));
        }
	};

	return serviceInstance;
});
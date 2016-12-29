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
        	this.name = 'rectangle';
        	this.point = {
        		x : Math.floor(Math.random() * width),
          		y : Math.floor(Math.random() * height)
        	};
        	this.width = Math.floor(Math.random() * (width - this.point.x));
        	this.height = Math.floor(Math.random() * (height - this.point.y));
        },

        Square: function squareConstruct(width, height){
        	this.name = 'square';
        	this.point = {
        		x : Math.floor(Math.random() * width),
          		y : Math.floor(Math.random() * height)
        	};
        	var d = Math.min(Math.floor(Math.random() * (width - this.point.x)), Math.floor(Math.random() * (height - this.point.y)));
        	this.width = d;
        	this.height = d;
        },

        Circle: function circleConstruct(width, height) {
        	this.name = 'circle';
        	this.point = {
        		x : Math.floor(Math.random() * width),
          		y : Math.floor(Math.random() * height)
        	};
        	this.radius = Math.min(Math.floor(Math.random() * Math.min(width - this.point.x, this.point.x)), Math.floor(Math.random() * Math.min(height - this.point.y, this.point.y)));
        }
	};

	return serviceInstance;
});
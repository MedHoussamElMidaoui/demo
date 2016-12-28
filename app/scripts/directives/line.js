(function(app) {

  'use strict';

  app.directive('line', lineDirective);

  /* @ngInject */
  function lineDirective(mainSvc) {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope) {

        var canvas = scope.canvas;
        var svg = scope.svg;
        var config = {
          strokeWidth : 3,
          radius1: 3,
          radius2: 6
        };

        function createLine(line) {

          var lineElement = svg.append('line')
          .attr('x1', function() {
            return line.point1.x;
          })
          .attr('y1', function() {
            return line.point1.y;
          })
          .attr('x2', function(d, i) {
            return line.point2.x;
          })
          .attr('y2', function(d, i) {
            return line.point2.y;
          })
          .attr("stroke-width", config.strokeWidth)
          .style('stroke', '#000')
          .style('cursor', 'move');

          return lineElement;
        }

        function lineEvents(line, circle1, circle2) {

          line.call(d3.drag()
            .on('drag', function() {
              var mouse = d3.mouse(canvas);

              var newCoordinates = {
                x1: parseFloat(circle1.attr('cx')) + d3.event.dx,
                y1: parseFloat(circle1.attr('cy')) + d3.event.dy,
                x2: parseFloat(circle2.attr('cx')) + d3.event.dx,
                y2: parseFloat(circle2.attr('cy')) + d3.event.dy
              };
              if(newCoordinates.x1 + config.radius1 > 0 && newCoordinates.x1 + config.radius1 < scope.canvasWidth
                && newCoordinates.x2 + config.radius1 > 0 && newCoordinates.x2 + config.radius1 < scope.canvasWidth
                && newCoordinates.y1 + config.radius1 > 0 && newCoordinates.y1 + config.radius1 < scope.canvasHeight
                && newCoordinates.y2 + config.radius1 > 0 && newCoordinates.y2 + config.radius1 < scope.canvasHeight) {

                circle1.attr('cx', newCoordinates.x1)
                .attr('cy', newCoordinates.y1);

                circle2.attr('cx', newCoordinates.x2)
                .attr('cy', newCoordinates.y2);

                line.attr('x1', newCoordinates.x1)
                .attr('y1', newCoordinates.y1)
                .attr('x2', newCoordinates.x2)
                .attr('y2', newCoordinates.y2);
              }
          }))
        }

        function createCircle(point) {

          var circleElement = svg.append('circle')
          .attr('cx', point.x)
          .attr('cy', point.y)
          .attr('r', config.radius1);

          return circleElement;
        }

        function circleEvents(circle, line, side) {

          circle.on('mouseover', function() {
            circle.attr('r', config.radius2);
          })
          .on('mouseout', function() {
            circle.attr('r', config.radius1);
          })
          .call(d3.drag()
            .on("drag", function() {
              var mouse = d3.mouse(canvas);
              if(mouse[0]-config.radius1 > 0 && mouse[0]+config.radius1 < scope.canvasWidth && mouse[1]-config.radius1 > 0 && mouse[1]+config.radius1 < scope.canvasHeight) {
                circle.attr('cx', mouse[0]);
                circle.attr('cy', mouse[1]);
                line.attr('x'+side, mouse[0]);
                line.attr('y'+side, mouse[1]);
              }
            }))
        }

        function create() {

          //Create the object
          var line = new mainSvc.Line(scope.canvasWidth, scope.canvasHeight);

          //Create Elements
          var lineElement = createLine(line);
          var circleElement1 = createCircle(line.point1);
          var circleElement2 = createCircle(line.point2);

          //Add Events
          lineEvents(lineElement, circleElement1, circleElement2);
          circleEvents(circleElement1, lineElement, 1);
          circleEvents(circleElement2, lineElement, 2);
        }

        scope.createLine = create.bind(null);
      }

    };
  }

}(angular.module('demoApp')));
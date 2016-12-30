(function(app) {

  'use strict';

  /* @ngInject */
  function lineDirective(mainSvc) {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope) {

        var index = 0;
        var canvas = scope.canvas;
        var svg = scope.svg;
        var config = {
          strokeWidth : 3,
          radius1: 3,
          radius2: 6
        };
        var color = d3.schemeCategory20c;
        var borders = {
          top: 5,
          right: scope.canvasWidth - 5,
          bottom: scope.canvasHeight - 5,
          left: 5
        };

        function createLine(line) {

          var lineElement = svg.append('line')
          .attr('x1', line.point1.x)
          .attr('y1', line.point1.y)
          .attr('x2', line.point2.x)
          .attr('y2', line.point2.y)
          .attr("stroke-width", config.strokeWidth)
          .style('stroke', color[index  % 20])
          .style('cursor', 'move');

          return lineElement;
        }

        function lineEvents(line, circle1, circle2, lineItem) {

          line.on('dblclick', function() {
            line.remove();
            circle1.remove();
            circle2.remove();
            mainSvc.removeFromStorage(lineItem);
          })
          .call(d3.drag()
            .on('drag', function() {

              var newCoordinates = {
                x1: parseFloat(circle1.attr('cx')) + d3.event.dx,
                y1: parseFloat(circle1.attr('cy')) + d3.event.dy,
                x2: parseFloat(circle2.attr('cx')) + d3.event.dx,
                y2: parseFloat(circle2.attr('cy')) + d3.event.dy
              };
              if(newCoordinates.x1 - config.radius1 > borders.left && newCoordinates.x1 + config.radius1 < borders.right && newCoordinates.x2 - config.radius1 > borders.left && newCoordinates.x2 + config.radius1 < borders.right && newCoordinates.y1 - config.radius1 > borders.top && newCoordinates.y1 + config.radius1 < borders.bottom && newCoordinates.y2 - config.radius1 > borders.top && newCoordinates.y2 + config.radius1 < borders.bottom) {

                circle1.attr('cx', newCoordinates.x1)
                .attr('cy', newCoordinates.y1);

                circle2.attr('cx', newCoordinates.x2)
                .attr('cy', newCoordinates.y2);

                line.attr('x1', newCoordinates.x1)
                .attr('y1', newCoordinates.y1)
                .attr('x2', newCoordinates.x2)
                .attr('y2', newCoordinates.y2);
              }
            })
            .on('end', function() {
              lineItem.point1 = {x: parseFloat(line.attr('x1')), y: parseFloat(line.attr('y1'))};
              lineItem.point2 = {x: parseFloat(line.attr('x2')), y: parseFloat(line.attr('y2'))};

              mainSvc.editInStorage(lineItem);
            }));
        }

        function createCircle(point) {

          var circleElement = svg.append('circle')
          .attr('cx', point.x)
          .attr('cy', point.y)
          .attr('r', config.radius1)
          .style('fill', '#000');

          return circleElement;
        }

        function circleEvents(circle, line, side, lineItem) {

          circle.on('mouseover', function() {
            circle.attr('r', config.radius2);
          })
          .on('mouseout', function() {
            circle.attr('r', config.radius1);
          })
          .call(d3.drag()
            .on("drag", function() {
              var mouse = d3.mouse(canvas);
              if(mouse[0]-config.radius1 > borders.left && mouse[0]+config.radius1 < borders.right && mouse[1]-config.radius1 > borders.top && mouse[1]+config.radius1 < borders.bottom) {
                circle.attr('cx', mouse[0]);
                circle.attr('cy', mouse[1]);
                line.attr('x'+side, mouse[0]);
                line.attr('y'+side, mouse[1]);
              }
            }));
        }

        function create() {

          //Create the object
          var line, d = 0;
          while(d < 20) {

            line = new mainSvc.Line(scope.canvasWidth, scope.canvasHeight);
            d = Math.sqrt(Math.pow((line.point2.x - line.point1.x), 2) + Math.pow((line.point2.y - line.point1.y), 2));
          }

          //Save Element 
          line.index = mainSvc.addToStorage(line);

          //Create Elements
          var lineElement = createLine(line);
          var circleElement1 = createCircle(line.point1);
          var circleElement2 = createCircle(line.point2);

          //Add Events
          lineEvents(lineElement, circleElement1, circleElement2, line);
          circleEvents(circleElement1, lineElement, 1, line);
          circleEvents(circleElement2, lineElement, 2, line);

          index++;
        }

        scope.createLine = create.bind(null);
      }

    };
  }

  app.directive('line', lineDirective);

}(angular.module('demoApp')));
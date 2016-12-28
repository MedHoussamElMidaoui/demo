(function(app) {

  'use strict';

  app.directive('rectangle', rectangleDirective);

  /* @ngInject */
  function rectangleDirective(mainSvc) {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope) {

        var index = 0;
        var canvas = scope.canvas;
        var svg = scope.svg;
        var config = {
          strokeWidth : 2,
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
        
        function createRectangle(rectangle) {

          var rectangleElement = svg.append('rect')
          .attr('x', rectangle.point.x)
          .attr('y', rectangle.point.y)
          .attr('width', rectangle.width)
          .attr('height', rectangle.height)
          .style('fill', color[index  % 20])
          .style('cursor', 'move');

          return rectangleElement;
        }

        function rectangleEvents(rectangle, top, right, left, bottom) {

          rectangle.on('dblclick', function() {
            rectangle.remove();
            top.remove();
            right.remove();
            left.remove();
            bottom.remove();
          })
          .call(d3.drag()
            .on('drag', function() {

              var newCoordinates = {
                x: parseFloat(rectangle.attr('x')) + d3.event.dx,
                y: parseFloat(rectangle.attr('y')) + d3.event.dy,
                width: parseFloat(rectangle.attr('width')),
                height: parseFloat(rectangle.attr('height'))
              };
              if(newCoordinates.x > borders.left && newCoordinates.x + newCoordinates.width < borders.right
                && newCoordinates.y > borders.top && newCoordinates.y + newCoordinates.height < borders.bottom) {

                rectangle.attr('x', newCoordinates.x)
              .attr('y', newCoordinates.y);

              top.attr('x1', newCoordinates.x).attr('y1', newCoordinates.y).attr('x2', newCoordinates.x + newCoordinates.width).attr('y2', newCoordinates.y);
              left.attr('x1', newCoordinates.x).attr('y1', newCoordinates.y).attr('x2', newCoordinates.x).attr('y2', newCoordinates.y + newCoordinates.height);
              right.attr('x1', newCoordinates.x + newCoordinates.width).attr('y1', newCoordinates.y).attr('x2', newCoordinates.x + newCoordinates.width).attr('y2', newCoordinates.y + newCoordinates.height);
              bottom.attr('x1', newCoordinates.x).attr('y1', newCoordinates.y + newCoordinates.height).attr('x2', newCoordinates.x + newCoordinates.width).attr('y2', newCoordinates.y + newCoordinates.height);
            }
          }))
        }

        function createTopLine(rectangle, rectangleElement) {

          var lineElement = svg.append('line')
          .attr('x1', rectangle.point.x)
          .attr('y1', rectangle.point.y)
          .attr('x2', rectangle.point.x + rectangle.width)
          .attr('y2', rectangle.point.y)
          .attr("stroke-width", config.strokeWidth)
          .style('stroke', color[index  % 20])
          .style('cursor', 'n-resize')
          .call(d3.drag()
            .on('drag', function() {
              
              var newY = parseFloat(rectangleElement.attr('y')) + d3.event.dy;
              var dy = parseFloat(rectangleElement.attr('y')) + parseFloat(rectangleElement.attr('height'));
              var newHeight = dy - newY;

              if(newY > borders.top && newY < dy - 10) {
                lineElement.attr('y1', newY).attr('y2', newY);
                rectangleElement.attr('y', newY).attr('height', newHeight);
              }
          }))

          return lineElement;
        }

        function createLeftLine(rectangle, rectangleElement) {

          var lineElement = svg.append('line')
          .attr('x1', rectangle.point.x)
          .attr('y1', rectangle.point.y)
          .attr('x2', rectangle.point.x)
          .attr('y2', rectangle.point.y + rectangle.height)
          .attr("stroke-width", config.strokeWidth)
          .style('stroke', color[index  % 20])
          .style('cursor', 'e-resize');

          return lineElement;
        }

        function createRightLine(rectangle, rectangleElement) {

          var lineElement = svg.append('line')
          .attr('x1', rectangle.point.x + rectangle.width)
          .attr('y1', rectangle.point.y)
          .attr('x2', rectangle.point.x + rectangle.width)
          .attr('y2', rectangle.point.y + rectangle.height)
          .attr("stroke-width", config.strokeWidth)
          .style('stroke', color[index  % 20])
          .style('cursor', 'e-resize');

          return lineElement;
        }

        function createBottomLine(rectangle, rectangleElement) {

          var lineElement = svg.append('line')
          .attr('x1', rectangle.point.x)
          .attr('y1', rectangle.point.y + rectangle.height)
          .attr('x2', rectangle.point.x + rectangle.width)
          .attr('y2', rectangle.point.y + rectangle.height)
          .attr("stroke-width", config.strokeWidth)
          .style('stroke', color[index  % 20])
          .style('cursor', 'n-resize');

          return lineElement;
        }

        function create() {

          //Create the object
          var rectangle = new mainSvc.Rectangle(scope.canvasWidth, scope.canvasHeight);

          //Create Elements
          var rectangleElement = createRectangle(rectangle);
          var topLineElement = createTopLine(rectangle, rectangleElement);
          var leftLineElement = createLeftLine(rectangle, rectangleElement);
          var rightLineElement = createRightLine(rectangle, rectangleElement);
          var bottomLineElement = createBottomLine(rectangle, rectangleElement);

          //Add Events
          rectangleEvents(rectangleElement, topLineElement, leftLineElement, rightLineElement, bottomLineElement);

          index++;
        }

        scope.createRectangle = create.bind(null);
      }

    };
  }

}(angular.module('demoApp')));
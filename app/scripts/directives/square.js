(function(app) {

  'use strict';

  /* @ngInject */
  function squareDirective(mainSvc) {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope) {
        
        var index = 0;
        var svg = scope.svg;
        var config = {
          strokeWidth : 4,
          radius1: 3,
          radius2: 6
        };
        var color = d3.schemeCategory20b;
        var borders = {
          top: 5,
          right: scope.canvasWidth - 5,
          bottom: scope.canvasHeight - 5,
          left: 5
        };

        function createSquare(square) {

          var squareElement = svg.append('rect')
          .attr('x', square.point.x)
          .attr('y', square.point.y)
          .attr('width', square.width)
          .attr('height', square.height)
          .style('fill', color[index  % 20])
          .style('fill-opacity', '0.4')
          .style('cursor', 'move')
          .style('stroke', '#000')
          .style('stroke-width', '2px');

          return squareElement;
        }

        function squareEvents(square, circle1, circle2, circle3, circle4, squareItem) {

          square.on('dblclick', function() {
            square.remove();
            circle1.remove();
            circle2.remove();
            circle3.remove();
            circle4.remove();
            mainSvc.removeFromStorage(squareItem);
          })
          .call(d3.drag()
            .on('drag', function() {

              var newCoordinates = {
                x: parseFloat(square.attr('x')) + d3.event.dx,
                y: parseFloat(square.attr('y')) + d3.event.dy,
                width: parseFloat(square.attr('width')),
                height: parseFloat(square.attr('height'))
              };
              if(newCoordinates.x > borders.left && newCoordinates.x + newCoordinates.width < borders.right && newCoordinates.y > borders.top && newCoordinates.y + newCoordinates.height < borders.bottom) {

              square.attr('x', newCoordinates.x).attr('y', newCoordinates.y);

              circle1.attr('cx', newCoordinates.x).attr('cy', newCoordinates.y);
              circle2.attr('cx', newCoordinates.x + newCoordinates.width).attr('cy', newCoordinates.y);
              circle3.attr('cx', newCoordinates.x).attr('cy', newCoordinates.y + newCoordinates.height);
              circle4.attr('cx', newCoordinates.x + newCoordinates.width).attr('cy', newCoordinates.y + newCoordinates.height);
            }
          })
          .on('end', function() {
            squareItem.point = {x: parseFloat(square.attr('x')), y: parseFloat(square.attr('y'))};

            mainSvc.editInStorage(squareItem);
          }));
        }

        function createCircle(point, cursor) {

          var circleElement = svg.append('circle')
          .attr('cx', point.x)
          .attr('cy', point.y)
          .attr('r', config.radius1)
          .style('cursor', cursor)
          .style('fill', '#000')
          .on('mouseover', function() {
            circleElement.attr('r', config.radius2);
          })
          .on('mouseout', function() {
            circleElement.attr('r', config.radius1);
          });

          return circleElement;
        }

        function setAttributes(square, circle1, circle2, circle3, circle4, newCoordinates) {

          square.attr('x', newCoordinates.x).attr('y', newCoordinates.y).attr('width', newCoordinates.width).attr('height', newCoordinates.height);
          circle1.attr('cx', newCoordinates.x).attr('cy', newCoordinates.y);
          circle2.attr('cx', newCoordinates.x + newCoordinates.width).attr('cy', newCoordinates.y);
          circle3.attr('cx', newCoordinates.x).attr('cy', newCoordinates.y + newCoordinates.height);
          circle4.attr('cx', newCoordinates.x + newCoordinates.width).attr('cy', newCoordinates.y + newCoordinates.height);
        }

        function endDrag(square, squareItem) {
          squareItem.point = {x: parseFloat(square.attr('x')), y: parseFloat(square.attr('y'))};
          squareItem.width = parseFloat(square.attr('width'));
          squareItem.height = parseFloat(square.attr('height'));

          mainSvc.editInStorage(squareItem);
        }

        function circlesEvents(square, circle1, circle2, circle3, circle4, squareItem) {

          circle1.call(d3.drag()
            .on('drag', function() {
              
              var d = Math.abs(d3.event.dx) > Math.abs(d3.event.dy) ? d3.event.dx : d3.event.dy;
              var newCoordinates = {
                x: parseFloat(square.attr('x')) + d,
                y: parseFloat(square.attr('y')) + d,
                width: parseFloat(square.attr('width')) - d,
                height: parseFloat(square.attr('height')) - d
              };

              if(newCoordinates.x > borders.left && newCoordinates.y > borders.top && newCoordinates.width > 20) {
                setAttributes(square, circle1, circle2, circle3, circle4, newCoordinates);
              } 
          })
          .on('end', function() {
            endDrag(square, squareItem)
          }));

          circle2.call(d3.drag()
            .on('drag', function() {
              
              var d = Math.abs(d3.event.dx) > Math.abs(d3.event.dy) ? -d3.event.dx : d3.event.dy;
              var newCoordinates = {
                x: parseFloat(square.attr('x')),
                y: parseFloat(square.attr('y')) + d,
                width: parseFloat(square.attr('width')) - d,
                height: parseFloat(square.attr('height')) - d
              };

              if(newCoordinates.x + newCoordinates.width < borders.right && newCoordinates.y > borders.top && newCoordinates.width > 20) {
                setAttributes(square, circle1, circle2, circle3, circle4, newCoordinates);
              }
          })
          .on('end', function() {
            endDrag(square, squareItem)
          }));

          circle3.call(d3.drag()
            .on('drag', function() {
              
              var d = Math.abs(d3.event.dx) > Math.abs(d3.event.dy) ? d3.event.dx : -d3.event.dy;
              var newCoordinates = {
                x: parseFloat(square.attr('x')) + d,
                y: parseFloat(square.attr('y')),
                width: parseFloat(square.attr('width')) - d,
                height: parseFloat(square.attr('height')) - d
              };

              if(newCoordinates.x > borders.left && newCoordinates.y + newCoordinates.height < borders.bottom && newCoordinates.width > 20) {
                setAttributes(square, circle1, circle2, circle3, circle4, newCoordinates);
              }
          })
          .on('end', function() {
            endDrag(square, squareItem)
          }));

          circle4.call(d3.drag()
            .on('drag', function() {
              
              var d = Math.abs(d3.event.dx) > Math.abs(d3.event.dy) ? -d3.event.dx : -d3.event.dy;
              var newCoordinates = {
                x: parseFloat(square.attr('x')),
                y: parseFloat(square.attr('y')),
                width: parseFloat(square.attr('width')) - d,
                height: parseFloat(square.attr('height')) - d
              };

              if(newCoordinates.x + newCoordinates.width < borders.right && newCoordinates.y + newCoordinates.height < borders.bottom && newCoordinates.width > 20) {
                setAttributes(square, circle1, circle2, circle3, circle4, newCoordinates);
              }
          })
          .on('end', function() {
            endDrag(square, squareItem)
          }));
        }

        function create(squareItem) {
          
          //Create the object
          var square = squareItem;
          if(!square) {
            square = {width: 0};

            while(square.width < 20) {

              square = new mainSvc.Square(scope.canvasWidth, scope.canvasHeight);
            }

            square.index = mainSvc.addToStorage(square);
          }

          //Create Elements
          var squareElement = createSquare(square);
          var circleElement1 = createCircle(square.point, 'nw-resize');
          var circleElement2 = createCircle({x: square.point.x + square.width, y: square.point.y}, 'nesw-resize');
          var circleElement3 = createCircle({x: square.point.x, y: square.point.y + square.height}, 'nesw-resize');
          var circleElement4 = createCircle({x: square.point.x + square.width, y: square.point.y + square.height}, 'nw-resize');

          //Add Events
          squareEvents(squareElement, circleElement1, circleElement2, circleElement3, circleElement4, square);
          circlesEvents(squareElement, circleElement1, circleElement2, circleElement3, circleElement4, square);

          index++;

        }

        scope.createSquare = create.bind(null);
      }

    };
  }

  app.directive('square', squareDirective);

}(angular.module('demoApp')));
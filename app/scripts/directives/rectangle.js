(function(app) {

  'use strict';

  /* @ngInject */
  function rectangleDirective(mainSvc) {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope) {

        var index = 0;
        var svg = scope.svg;
        var config = {
          strokeWidth : 2
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
          .style('fill-opacity', '0.4')
          .style('cursor', 'move');

          return rectangleElement;
        }

        function rectangleEvents(rectangle, top, right, left, bottom, rectangleItem) {

          rectangle.on('dblclick', function() {
            rectangle.remove();
            top.remove();
            right.remove();
            left.remove();
            bottom.remove();
            mainSvc.removeFromStorage(rectangleItem);
          })
          .call(d3.drag()
            .on('drag', function() {

              var newCoordinates = {
                x: parseFloat(rectangle.attr('x')) + d3.event.dx,
                y: parseFloat(rectangle.attr('y')) + d3.event.dy,
                width: parseFloat(rectangle.attr('width')),
                height: parseFloat(rectangle.attr('height'))
              };
              if(newCoordinates.x > borders.left && newCoordinates.x + newCoordinates.width < borders.right && newCoordinates.y > borders.top && newCoordinates.y + newCoordinates.height < borders.bottom) {

                rectangle.attr('x', newCoordinates.x).attr('y', newCoordinates.y);

                top.attr('x1', newCoordinates.x).attr('y1', newCoordinates.y).attr('x2', newCoordinates.x + newCoordinates.width).attr('y2', newCoordinates.y);
                right.attr('x1', newCoordinates.x).attr('y1', newCoordinates.y).attr('x2', newCoordinates.x).attr('y2', newCoordinates.y + newCoordinates.height);
                left.attr('x1', newCoordinates.x + newCoordinates.width).attr('y1', newCoordinates.y).attr('x2', newCoordinates.x + newCoordinates.width).attr('y2', newCoordinates.y + newCoordinates.height);
                bottom.attr('x1', newCoordinates.x).attr('y1', newCoordinates.y + newCoordinates.height).attr('x2', newCoordinates.x + newCoordinates.width).attr('y2', newCoordinates.y + newCoordinates.height);
              }
            })
            .on('end', function() {
              rectangleItem.point = {x: parseFloat(rectangle.attr('x')), y: parseFloat(rectangle.attr('y'))};

              mainSvc.editInStorage(rectangleItem);
            }));
        }

        function createLine(point1, point2, cursor, name) {

          var lineElement = svg.append('line')
          .attr('x1', point1.x)
          .attr('y1', point1.y)
          .attr('x2', point2.x)
          .attr('y2', point2.y)
          .attr("stroke-width", config.strokeWidth)
          .attr('name', name)
          .style('stroke', '#000')
          .style('cursor', cursor);

          return lineElement;
        }

        function endDrag(rectangle, rectangleItem) {
          rectangleItem.point = {x: parseFloat(rectangle.attr('x')), y: parseFloat(rectangle.attr('y'))};
          rectangleItem.width = parseFloat(rectangle.attr('width'));
          rectangleItem.height = parseFloat(rectangle.attr('height'));

          mainSvc.editInStorage(rectangleItem);
        }

        function linesEvents(rectangle, top, right, left, bottom, rectangleItem) {

          top.call(d3.drag()
            .on('drag', function() {

              var dy = parseFloat(rectangle.attr('y')) + parseFloat(rectangle.attr('height'));
              var newY = parseFloat(rectangle.attr('y')) + d3.event.dy;
              var newHeight = dy - newY;

              if(newY > borders.top && newHeight > 10) {
                rectangle.attr('y', newY).attr('height', newHeight);
                top.attr('y1', newY).attr('y2', newY);
                right.attr('y1', newY);
                left.attr('y1', newY);
              }
            })
            .on('end', function() {
              endDrag(rectangle, rectangleItem)
            }));

          left.call(d3.drag()
            .on('drag', function() {

              var dx = parseFloat(rectangle.attr('x')) + parseFloat(rectangle.attr('width'));
              var newX = parseFloat(rectangle.attr('x')) + d3.event.dx;
              var newWidth = dx - newX;

              if(newX > borders.left && newWidth > 10) {
                rectangle.attr('x', newX).attr('width', newWidth);
                left.attr('x1', newX).attr('x2', newX);
                top.attr('x1', newX);
                bottom.attr('x1', newX);
              }
            })
            .on('end', function() {
              endDrag(rectangle, rectangleItem)
            }));

          right.call(d3.drag()
            .on('drag', function() {

              var dx = parseFloat(rectangle.attr('x')) + parseFloat(rectangle.attr('width'));
              var newDx = dx + d3.event.dx;
              var newWidth = newDx - parseFloat(rectangle.attr('x'));

              if(newDx < borders.right && newWidth > 10) {
                rectangle.attr('width', newWidth);
                right.attr('x1', newDx).attr('x2', newDx);
                top.attr('x2', newDx);
                bottom.attr('x2', newDx);
              }
            })
            .on('end', function() {
              endDrag(rectangle, rectangleItem)
            }));

          bottom.call(d3.drag()
            .on('drag', function() {

              var dy = parseFloat(rectangle.attr('y')) + parseFloat(rectangle.attr('height'));
              var newDy = dy + d3.event.dy;
              var newHeight = newDy - parseFloat(rectangle.attr('y'));

              if(newDy < borders.bottom && newHeight > 10) {
                rectangle.attr('height', newHeight);
                bottom.attr('y1', newDy).attr('y2', newDy);
                right.attr('y2', newDy);
                left.attr('y2', newDy);
              }
            })
            .on('end', function() {
              endDrag(rectangle, rectangleItem)
            }));
        }

        function create(rectangleItem) {

          //Create the object
          var rectangle = rectangleItem;
          if(!rectangleItem) {
            rectangle = {width: 0, height: 0};

            while(rectangle.width < 20 || rectangle.height < 20) {

              rectangle = new mainSvc.Rectangle(scope.canvasWidth, scope.canvasHeight);
            }

            rectangle.index = mainSvc.addToStorage(rectangle);
          }

          //Create Elements
          var rectangleElement = createRectangle(rectangle);
          var topLineElement = createLine(rectangle.point, {x: rectangle.point.x + rectangle.width, y: rectangle.point.y}, 'n-resize', 'top');
          var leftLineElement = createLine(rectangle.point, {x: rectangle.point.x, y: rectangle.point.y + rectangle.height}, 'e-resize', 'left');
          var rightLineElement = createLine({x: rectangle.point.x + rectangle.width, y: rectangle.point.y}, {x: rectangle.point.x + rectangle.width, y: rectangle.point.y + rectangle.height}, 'e-resize', 'right');
          var bottomLineElement = createLine({x: rectangle.point.x, y: rectangle.point.y  + rectangle.height}, {x: rectangle.point.x + rectangle.width, y: rectangle.point.y + rectangle.height}, 'n-resize', 'bottom');

          //Add Events
          rectangleEvents(rectangleElement, topLineElement, leftLineElement, rightLineElement, bottomLineElement, rectangle);
          linesEvents(rectangleElement, topLineElement, rightLineElement, leftLineElement, bottomLineElement, rectangle);

          index++;
        }

        scope.createRectangle = create.bind(null);
      }

    };
  }

  app.directive('rectangle', rectangleDirective);

}(angular.module('demoApp')));
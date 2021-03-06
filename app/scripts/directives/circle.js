(function(app) {

  'use strict';

  /* @ngInject */
  function circleDirective(mainSvc) {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope) {
        
        var index = 0;
        var svg = scope.svg;
        var color = d3.schemeCategory20b;
        var borders = {
          top: 5,
          right: scope.canvasWidth - 5,
          bottom: scope.canvasHeight - 5,
          left: 5
        };

        function createCircle(circle) {

          var circleElement = svg.append('circle')
          .attr('cx', circle.point.x)
          .attr('cy', circle.point.y)
          .attr('r', circle.radius)
          .style('cursor', 'move')
          .style('fill', color[index  % 20])
          .style('fill-opacity', '0.4');

          return circleElement;
        }

        function circleEvents(circle, contour, circleItem) {

          circle.on('dblclick', function() {
            circle.remove();
            contour.remove();
            mainSvc.removeFromStorage(circleItem);
          })
          .call(d3.drag()
            .on('drag', function() {

              var newCoordinates = {
                x: parseFloat(circle.attr('cx')) + d3.event.dx,
                y: parseFloat(circle.attr('cy')) + d3.event.dy,
                radius: parseFloat(circle.attr('r'))
              };
              if(newCoordinates.x + newCoordinates.radius < borders.right && newCoordinates.x - newCoordinates.radius > borders.left && newCoordinates.y + newCoordinates.radius < borders.bottom && newCoordinates.y - newCoordinates.radius > borders.top) {

                circle.attr('cx', newCoordinates.x).attr('cy', newCoordinates.y);

                contour.attr('cx', newCoordinates.x).attr('cy', newCoordinates.y);
              }
            })
            .on('end', function() {
              circleItem.point = {x: parseFloat(circle.attr('cx')), y: parseFloat(circle.attr('cy'))};

              mainSvc.editInStorage(circleItem);
            }));
        }

        function createContour(circle) {

          var circleElement = svg.append('circle')
          .attr('cx', circle.point.x)
          .attr('cy', circle.point.y)
          .attr('r', circle.radius + 1)
          .style('cursor', 'pointer')
          .style('fill', 'transparent')
          .style('stroke', '#000')
          .style('stroke-width', '3px');

          return circleElement;
        }

        function contourEvents(circle, contour, circleItem) {

          contour.call(d3.drag().on('drag', function() {

            var x = parseFloat(circle.attr('cx'));
            var y = parseFloat(circle.attr('cy'));

            var d = Math.sqrt(Math.pow(d3.event.x - x, 2) + Math.pow(d3.event.y - y, 2));

            if(d > 20 && x + d < borders.right && x - d > borders.left && y + d < borders.bottom && y - d > borders.top) {
              circle.attr('r', d);
              contour.attr('r', d + 1);
            }
          })
          .on('end', function() {
            circleItem.radius = parseFloat(circle.attr('r'));

            mainSvc.editInStorage(circleItem);
          }));
        }

        function create(circleItem) {
          
          //Create the object
          var circle = circleItem;
          if(!circle) {
            circle = {radius : 0};
            while(circle.radius < 20) {

              circle = new mainSvc.Circle(scope.canvasWidth, scope.canvasHeight);
            }

            circle.index = mainSvc.addToStorage(circle);
          }

          //Create Elements
          var contourElement = createContour(circle);
          var circleElement = createCircle(circle);

          //Add Events
          circleEvents(circleElement, contourElement, circle);
          contourEvents(circleElement, contourElement, circle);

          index++;
        }

        scope.createCircle = create.bind(null);
      }

    };
  }

  app.directive('circle', circleDirective);

}(angular.module('demoApp')));
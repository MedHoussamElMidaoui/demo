(function(app) {

  'use strict';

  app.directive('rectangle', rectangleDirective);

  /* @ngInject */
  function rectangleDirective() {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope, element) {
        
        function create() {
          
          console.log('createRectangle function')
        }

        scope.createRectangle = create.bind(null);
      }

    };
  }

}(angular.module('demoApp')));
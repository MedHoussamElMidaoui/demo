(function(app) {

  'use strict';

  app.directive('square', squareDirective);

  /* @ngInject */
  function squareDirective() {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope, element) {
        
        function create() {
          
          console.log('createSquare function')
        }

        scope.createSquare = create.bind(null);
      }

    };
  }

}(angular.module('demoApp')));
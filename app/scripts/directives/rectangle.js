(function(app) {

  'use strict';

  app.directive('rectangle', rectangleDirective);

  /* @ngInject */
  function rectangleDirective() {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope, element) {
        
      }

    };
  }

}(angular.module('demoApp')));
(function(app) {

  'use strict';

  app.directive('square', squareDirective);

  /* @ngInject */
  function squareDirective() {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope, element) {
        
      }

    };
  }

}(angular.module('demoApp')));
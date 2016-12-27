(function(app) {

  'use strict';

  app.directive('line', lineDirective);

  /* @ngInject */
  function lineDirective() {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope, element) {
        
      }

    };
  }

}(angular.module('demoApp')));
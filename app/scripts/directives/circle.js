(function(app) {

  'use strict';

  app.directive('circle', circleDirective);

  /* @ngInject */
  function circleDirective() {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope, element) {
        
      }

    };
  }

}(angular.module('demoApp')));
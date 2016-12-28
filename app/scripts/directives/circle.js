(function(app) {

  'use strict';

  app.directive('circle', circleDirective);

  /* @ngInject */
  function circleDirective() {
    return {
      restrict: 'A',
      scope: false,

      link: function(scope, element) {
        
        function create() {
          
          console.log('createCircle function')
        }

        scope.createCircle = create.bind(null);
      }

    };
  }

}(angular.module('demoApp')));
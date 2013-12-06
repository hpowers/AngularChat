'use strict';

angular.module('chatApp', [
  'ngRoute',
  // 'chatApp.filters',
  'chatApp.services',
  // 'chatApp.directives',
  'chatApp.controllers'
  ])
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'partials/partial1.html',
        controller: 'Chat'
      })
      .otherwise({
        redirectsTo: '/'
      });
  });

'use strict';

angular.module('chatApp', [
  'ngRoute',
  // 'chatApp.filters',
  'chatApp.services',
  'chatApp.directives',
  'chatApp.controllers'
  ])
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'partials/chat.html',
        controller: 'Chat'
      })
      .otherwise({
        redirectsTo: '/'
      });
  });

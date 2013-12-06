'use strict';

/* Controllers */

angular.module('chatApp.controllers',[])
  .controller('Chat', function($scope, socket){
    $scope.chat = [];

    socket.on('chat', function (data) {
      console.log(data);
      $scope.chat.push(data);
    });

    $scope.talk = function(){
      $scope.chat.push({
        text: $scope.new_msg
      });

      socket.emit('chat', { text: $scope.new_msg });
      $scope.new_msg = '';
    };
  });

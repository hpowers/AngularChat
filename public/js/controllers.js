'use strict';

/* Controllers */

angular.module('chatApp.controllers',[])
  .controller('Chat', function($scope, socket){
    $scope.chat = [];
    $scope.user = "Anonymous Coward";

    socket.on('chat', function (data) {
      console.log(data);
      $scope.chat.push(data);
    });

    $scope.talk = function(){
      var msgIndex = $scope.chat.push({
        user: $scope.user,
        text: $scope.new_msg
      });


      // debugger;

      socket.emit('chat', $scope.chat[msgIndex-1]);
      $scope.new_msg = '';
    };
  });

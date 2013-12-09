'use strict';

/* Controllers */

angular.module('chatApp.controllers',[])
  .controller('Chat', function($scope, socket){
    $scope.chat = [];
    $scope.username = "Anonymous Coward";

    $scope.users = {
      count: 1,
      names: [$scope.username]
    };

    socket.on('chat', function (data) {
      console.log('socket data', data);
      $scope.chat.push(data);
      console.log('chat', $scope.chat);
    });

    // socket.on('users', function(data){
      // $scope.users = data;
      // console.log(data);
    // });

    $scope.talk = function(){
      var msgIndex = $scope.chat.push({
        username: $scope.username,
        text: $scope.new_msg
      });

      socket.emit('chat', $scope.chat[msgIndex-1]);
      $scope.new_msg = '';
    };
  });

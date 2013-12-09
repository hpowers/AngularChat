'use strict';

/* Controllers */

angular.module('chatApp.controllers',[])
  .controller('Chat', function($scope, socket){
    $scope.chat = [];
    // $scope.users = {};
    $scope.name = "Anonymous Coward";

    $scope.users = {
      count: 1,
      names: [$scope.name]
    };

    // receive a message
    socket.on('chat', function (data) {
      // console.log('socket data', data);
      $scope.chat.push(data);
      // console.log('chat', $scope.chat);
    });

    // receive my id and user list on connect
    socket.on('init', function(data){
      $scope.id = data.id;
      $scope.users = data.users;
      $scope.userCount = Object.keys(data.users).length;

      // console.log(data.users);
    });

    // receive updates
    socket.on('update', function(data){
      // console.log(data);

      switch (data.type){
        case 'name change':
          $scope.users[data.packet.id] = data.packet.name;
          break;

        case 'user leave':
          delete $scope.users[data.packet.id];
          $scope.userCount--;
          break;

        case 'new user':
          $scope.users[data.packet.id] = data.packet.name;
          $scope.userCount++;
          break;
      }
    });

    // send a message
    $scope.talk = function(){

      // broadcast
      socket.emit('chat', {
        text: $scope.new_msg
      });

      // local echo
      $scope.chat.push({
        id: $scope.id,
        date: new Date().getTime(),
        text: $scope.new_msg
      });

      // reset
      $scope.new_msg = '';
    };

    // watch for name changes
    $scope.$watch('name', function(){

      // tell the server
      socket.emit('update', {
        name: $scope.name
      });

      // update local
      $scope.users[$scope.id] = $scope.name;

    });

  });

'use strict';

/* Controllers */

angular.module('chatApp.controllers',[])
  .controller('Chat', function($scope, socket, Insult){
    $scope.chat = [];
    $scope.users = {};
    $scope.nameMsg = 'What is your name?';

    // $scope.$watch('name', function(){
    //   console.log('watching...');
    //   if ($scope.name === 'Anonymous Coward') {
    //     $scope.nameMsg = 'What is your name?';
    //   } else {
    //     $scope.nameMsg = '';
    //   }
    // });

    // redefine search because names aren't on messages
    $scope.search = function (msg) {
      // figure out the name
      var name = $scope.users[msg.id] || 'deprecated';
      // chheck the name and the text for matches
      return !!((name.indexOf($scope.query || '') !== -1 || msg.text.indexOf($scope.query || '') !== -1));
    };

    $scope.toggleSearch = function(){

      if ($scope.searchToggle) {

        $scope.searchToggle = false;
        $scope.search = '';

        setTimeout(function(){
          document.getElementById('chat').focus();
        }, 200);

      } else {

        $scope.searchToggle = true;
        setTimeout(function(){
          document.getElementById('search').focus();
        }, 200);

      }

    };

    // default username
    $scope.name = "Anonymous Coward";

    // receive a message
    socket.on('chat', function (data) {
      // console.log('socket data', data);
      $scope.chat.push(data);
      // console.log('chat', $scope.chat);

      // hack to scroll down chat window
      setTimeout(function(){
        document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0].scrollHeight;
      }, 200);

    });

    // receive my id and user list on connect
    socket.on('init', function(data){

      $scope.id = data.id;
      $scope.users = data.users;
      $scope.userCount = Object.keys(data.users).length;

    });

    // receive updates
    socket.on('update', function(data){
      // console.log(data);

      switch (data.type){
        case 'name change':
          $scope.users[data.packet.id] = data.packet.name;
          break;

        case 'user leave':

          // craft a final message
          $scope.chat.push({
            id: data.packet.id,
            date: new Date().getTime(),
            text: $scope.users[data.packet.id] + ' has left the building'
          });

          delete $scope.users[data.packet.id];
          $scope.userCount--;
          break;

        case 'new user':
          $scope.users[data.packet.id] = data.packet.name;
          $scope.userCount++;
          // make an announcement
          // console.log('new user');
          $scope.chat.push({
            id: data.packet.id,
            date: new Date().getTime(),
            text: 'I am your King'
          });
          break;
      }
    });

    // send a message
    $scope.talk = function(){

      // broadcast
      socket.emit('chat', {
        text: $scope.new_msg || Insult()
      });

      // local echo
      $scope.chat.push({
        id: $scope.id,
        date: new Date().getTime(),
        text: $scope.new_msg || Insult()
      });

      // hack to scroll down chat window
      setTimeout(function(){
        document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0].scrollHeight;
      }, 200);

      // console.log('nothing');

      // reset
      $scope.new_msg = '';
    };

    // watch for name changes
    $scope.$watch('name', function(){


      if (!$scope.name || $scope.name === 'Anonymous Coward') {
        $scope.nameMsg = 'What is your name?';
      } else {
        $scope.nameMsg = '';
      }

      // tell the server
      socket.emit('update', {
        name: $scope.name || 'Anonymous Coward'
      });

      // update local
      $scope.users[$scope.id] = $scope.name || 'Anonymous Coward';

    });

  });

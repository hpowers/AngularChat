'use strict';

/* Controllers */

angular.module('chatApp.controllers',[])
  .controller('Chat', function($scope, Socket, Insult){

    // controller data
    $scope.chat    = [];
    $scope.users   = {};
    $scope.nameMsg = 'What is your name?';

    // custom search to allow searching names and message text
    // messages don't have names, they have id's that you can look
    // up in the users {} - so simply searching chat [] won't cut it
    $scope.search = function (msg) {

      var query   = ($scope.query || '').toLowerCase();

      var name    = ($scope.users[msg.id] || 'deprecated').toLowerCase();
      var hasName = (name.indexOf(query) !== -1);

      var text    = msg.text.toLowerCase();
      var hasText = (text.indexOf(query) !== -1);

      return (hasName || hasText);

    };

    $scope.congratulations = function(){
      // demo animated gif support in response to finding a hidden feature
      $scope.new_msg = 'http://i.imgur.com/SdP4oYu.gif';
      $scope.talk();
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
    Socket.on('chat', function (data) {
      // console.log('Socket data', data);
      $scope.chat.push(data);
      // console.log('chat', $scope.chat);

      // hack to scroll down chat window
      setTimeout(function(){
        document.getElementsByClassName('chat')[0].scrollTop = document.getElementsByClassName('chat')[0].scrollHeight;
      }, 200);

    });

    // receive my id and user list on connect
    Socket.on('init', function(data){

      $scope.id = data.id;
      $scope.users = data.users;
      $scope.userCount = Object.keys(data.users).length;

    });

    // receive updates
    Socket.on('update', function(data){
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

      $scope.new_msg = $scope.new_msg || Insult();

      // broadcast
      Socket.emit('chat', {
        text: $scope.new_msg
      });

      // local echo
      $scope.chat.push({
        id: $scope.id,
        date: new Date().getTime(),
        text: $scope.new_msg
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
      Socket.emit('update', {
        name: $scope.name || 'Anonymous Coward'
      });

      // update local
      $scope.users[$scope.id] = $scope.name || 'Anonymous Coward';

    });

  });

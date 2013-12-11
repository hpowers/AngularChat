'use strict';

/* Controllers */

angular.module('chatApp.controllers',[])
  .controller('Chat', function($scope, socket, insult){

    // controller data
    $scope.chat         = [];
    $scope.users        = {};
    $scope.DEFAULT_NAME = 'Anonymous Coward';
    $scope.namePtn = new RegExp('^(?!'+$scope.DEFAULT_NAME+')', 'gi');
    // $scope.namePtn      = /^(?!test)/gi;
    $scope.name         = $scope.DEFAULT_NAME;

    // scroll chat to the bottom
    // not sure if this should be a directive? - because it is manipulating DOM
    // but wasn't sure how I would trigger it
    var scrollBottom = function(){
      // timeout to make sure DOM has updated - better way of doing this?
      setTimeout(function(){
        var chatDisplay = document.getElementById('chat-display');
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
      }, 10);
    };

    // receive my id and user list
    socket.on('init', function(data){

      $scope.id = data.id;
      $scope.users = data.users;
      // figure out how many users there are
      $scope.userCount = Object.keys(data.users).length;

    });

    // receive a message
    socket.on('chat', function (data) {
      $scope.chat.push(data);
      scrollBottom();
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
          // remove the user
          delete $scope.users[data.packet.id];
          $scope.userCount--;
          break;

        case 'new user':
          // store the user
          $scope.users[data.packet.id] = data.packet.name;
          // incrememnt the count
          $scope.userCount++;
          // craft an announcement
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

      // if the msg is blank, craft an insult
      $scope.new_msg = $scope.new_msg || insult();

      // broadcast msg
      socket.emit('chat', {
        text: $scope.new_msg
      });

      // local echo
      $scope.chat.push({
        id: $scope.id,
        date: new Date().getTime(),
        text: $scope.new_msg
      });

      scrollBottom();

      // reset input
      $scope.new_msg = '';
    };

    // watch for changes to my name
    $scope.$watch('name', function(){

      // tell the server
      socket.emit('update', {
        // If my name is empty, use default
        name: $scope.name || $scope.DEFAULT_NAME
      });

      // update local
      $scope.users[$scope.id] = $scope.name || $scope.DEFAULT_NAME;

    });

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

    // animated gif demo
    $scope.congratulations = function(){
      $scope.new_msg = 'http://i.imgur.com/SdP4oYu.gif';
      $scope.talk();
    };

  });

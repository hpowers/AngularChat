console.log('welcome');

// Socket.io
var socket = io.connect('/');
socket.on('chat', function (data) {
  console.log(data);
});
setTimeout(function(){
  socket.emit('chat', { my: 'test' });
}, 1000);

angular.module('chatApp', [])
  .controller('Chat', function($scope){
    $scope.chat = [
      {text: 'msg 1'},
      {text: 'msg 2'},
      {text: 'msg 3'},
    ];
    $scope.talk = function(){
      $scope.chat.push({
        text: $scope.new_msg
      });

      // socket.io hack
      socket.emit('chat', { text: $scope.new_msg });

      $scope.new_msg = '';
    };
  });

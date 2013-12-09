
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// setup socket.io
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var users = {};

io.sockets.on('connection', function (socket) {

  // add user to list
  users[socket.id] = 'Anonymous Coward';

  // send list to user
  socket.emit('users', {
    users: users
  });

  // tell others about new user
  socket.broadcast.emit('enter', {
    id: socket.id,
    name: users[socket.id]
  });

  // listen for chat & rebroadcast
  socket.on('chat', function(data) {
    socket.broadcast.emit('chat', data);
  });

  // listen for name change
  socket.on('update', function(data){
    // update the model
    users[socket.id] = data.name;
    // tell others
    socket.broadcast.emit('update', {
      id: socket.id,
      name: data.name
    });
  });

  // listen for disconnect
  socket.on('disconnect', function(){
    // tell others
    socket.broadcast.emit('exit', {
      id: socket.id
    });
    // remove the user
    delete users[socket.id];
  });

});


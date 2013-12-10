
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

// startup server with socket.io support
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// keep track of active users
var users = {};

// when a new socket is instantiated
io.sockets.on('connection', function (socket) {

  // add user to list
  users[socket.id] = 'Anonymous Coward';

  // send user their id and list of users
  socket.emit('init', {
    id: socket.id,
    users: users
  });

  // tell others about new user
  socket.broadcast.emit('update', {
    type: 'new user',
    packet: {
      id: socket.id,
      name: users[socket.id]
    }
  });

  // listen for chat & rebroadcast w/ ID & timestamp
  socket.on('chat', function(data) {
    // make a timestamp
    var date = new Date().getTime();

    socket.broadcast.emit('chat', {
      id: socket.id,
      date: date,
      text: data.text
    });
  });

  // listen for name change
  socket.on('update', function(data){
    // update the model
    users[socket.id] = data.name;
    // tell others
    socket.broadcast.emit('update', {
      type: 'name change',
      packet: {
        id: socket.id,
        name: data.name
      }
    });
  });

  // listen for disconnect
  socket.on('disconnect', function(){
    // tell others
    socket.broadcast.emit('update', {
      type: 'user leave',
      packet: {
        id: socket.id
      }
    });
    // remove the user
    delete users[socket.id];
  });

});


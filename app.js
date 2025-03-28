
var express = require('express');

var http = require('http');

var app = express();

var server = http.createServer(app);

var io = require('socket.io')(server);

var path = require('path');


app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


var name;

io.on('connection', (socket) => {
  console.log('new user connected');
  socket.on('joining msg', (username) => {
    name = username;
    io.emit('chat message', `${name} joined the chat`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', `${name} left the chat`);
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

server.listen(port, () => {
  console.log('server started at port 3000');
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
//Este sirve para mostrar cuando se conecta y desconecta un usuario.
/*io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});*/
//Este sirve para enviar el mensaje a la consola.
/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: '+msg);
  });
});*/

io.on('connection', function(socket){
  var nombre = "";
  socket.on('nick', function(nick){
    nombre = nick;
    socket.broadcast.emit('ingreso', nombre + " acaba de ingresar");
    console.log(nombre + ' se ha conectado');
  });
  socket.on('disconnect', function(){
    if (nombre !== ''){
      socket.broadcast.emit('salida', nombre + ' acaba de salir');
      console.log(nombre + ' se ha desconectado');
    }else{
      console.log('Alguien refrescó el navegador');
    }
  });
  socket.on('chat message', function(msg){
    //io.emit('chat message', nombre + " dice: " + msg);
    socket.broadcast.emit('chat message', nombre+ ' dice: ' + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var usuarios = [];
var conectados = [];
var colores = ['#32948A', '#F27405', '#B23203', '#793F52', '#FF523B', '#99C40A', '#C88900', '#363D9B', '#673B7E', '#1CB9D5', '#846600', '#DDCC0B', '#D9006A', '#19A901', '#034402', '#FE0303', '#BA33DC', '#544759', '#A197A6'];
function updateConnected(sock, conected){
  io.emit('conectados', conectados.sort());
}
io.on('connection', function(socket){
  socket.on('nick', function(nick){
    socket.usuario = nick;
    socket.usuarioColor = colores[Math.floor(Math.random() * colores.length)];
    usuarios.push(socket);
    conectados.push(socket.usuario);
    socket.broadcast.emit('ingreso', socket.usuario + " acaba de ingresar");
    updateConnected(socket, conectados);
    console.log(socket.usuario + ' se ha conectado. %d conectados', usuarios.length);
  });
  socket.on('disconnect', function(){
    if (socket.usuario !== undefined){
      conectados.splice(conectados.indexOf(socket.usuario), 1);
      usuarios.splice(socket, 1);
      socket.broadcast.emit('salida', socket.usuario + ' acaba de salir');
      updateConnected(socket, conectados);
      console.log(socket.usuario + ' se ha desconectado. %d conectados', usuarios.length);
    }else{
      console.log('Alguien refrescó el navegador');
    }
  });
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', {usuario: socket.usuario, mensaje: msg, color: socket.usuarioColor});
  });
});

http.listen(3000, function(){
  console.log('Chat server initialized');
});
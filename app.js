var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(2000);
console.log("Server started.");
 
var SOCKET_LIST = {};
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.role = "";
	socket.name = "";
	SOCKET_LIST[socket.id] = socket;
 
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
	});
 
});
 
setInterval(function(){
	var pack = [];
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.role="wolf";
		socket.name="tim";
		pack.push({
			name:socket.name,
			role:socket.role,
		});		
	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('assignRoles',pack);
	}
 
 
 
 
},1000/25);
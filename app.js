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
var PLAYER_LIST = {};
var GAME_LIST ={};

var Player = function(id) {
	var self = {
		name:"",
		role:"",
		id:id
	}
	return self;
}

var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
	socket.role = "";
	socket.name = "";

	SOCKET_LIST[socket.id] = socket;

	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;

	socket.on('create_game', function(data){
		var gameMaster = Player(socket.id)
		gameMaster.role = data.role;
		gameMaster.name = data.name;
		gameMaster.id = socket.id;
	
		GAME_LIST[socket.id] = gameMaster;
		PLAYER_LIST[socket.id] = gameMaster;
	})

	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		delete GAME_LIST[socket.id];
	});
});

setInterval (function() {
	var pack = [];
	for(var i in PLAYER_LIST) {
		var player = PLAYER_LIST[i];
		pack.push({
			name: player.name,
			role: player.role,
			id: player.id,
		});
	}
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit("lobby", pack);
	}
}, 2000)
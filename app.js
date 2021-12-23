var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(process.env.PORT || 2000);
console.log("Server started.");

var PLAYER_LIST = {};
var GAME_LIST = {};

var Player = function(id) {
	var self = {
		name:"",
		role:"",
		id:id
	}
	return self;
}

var GameMaster = function(id) {
	var self = {
		name:"",
		role:"",
		id:id,
		player_list:{}
	}
	return self;
}

var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
	socket.role = "";
	socket.name = "";

	socket.on('create_game', function(data){
		var gameMaster = GameMaster(socket.id)
		gameMaster.role = data.role;
		gameMaster.name = data.name;
		gameMaster.id = socket.id;
	
		GAME_LIST[socket.id] = gameMaster;
		socket.emit('display_master', gameMaster);
	})

	socket.on('join_game', function(data){
		var player = Player(socket.id)
		player.name = data.name;
		player.id = socket.id;
	
		PLAYER_LIST[socket.id] = player;
	})

	socket.on('find_room', function(data){
		console.log(GAME_LIST);
	})

	socket.on('disconnect',function(){
		delete PLAYER_LIST[socket.id];
		delete GAME_LIST[socket.id];
	});
});
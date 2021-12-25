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
var SOCKET_LIST = {};

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
	SOCKET_LIST[socket.id] = socket;

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
		GAME_LIST[data].player_list[socket.id] = PLAYER_LIST[socket.id];
	})

	socket.on('disconnect',function(){
		delete PLAYER_LIST[socket.id];
		delete GAME_LIST[socket.id];
		delete SOCKET_LIST[socket.id];
	});
});

setInterval (function() {
    var pack = [];
    for(var i in GAME_LIST) {
        var player = GAME_LIST[i];
		var nameList = [];
		for(var i in player.player_list){
			nameList.push(player.player_list[i].name);
		}
        pack.push({
			gameID: player.id,
            name_list: nameList
        });
    }
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
		for (i in pack){
			console.log(GAME_LIST[socket.id])
			if(GAME_LIST[socket.id] === pack[i].gameID) {
				socket.emit("update_lobby", pack);
			}
		}
    }
}, 2000)
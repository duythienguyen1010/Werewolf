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
var gameMaster ={};

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


	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});

socket.on('create_game', function(data){
	socket.role = data.role;
	socket.name = data.name;
})

});
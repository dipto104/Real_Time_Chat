var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

users=[];
connections=[];

server.listen(process.env.PORT || 3000);
console.log("server running ...")

app.get('/',function(req,res) {
	res.sendFile(__dirname + '/index.html');
	// body...
});

io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('connected : %s sockets connected', connections.length);

	//disconnected
	socket.on('disconnect',function(data){
		//if(!socket.username) return;

		users.splice(users.indexOf(socket.username),1);
		Updateusername()

		connections.splice(connections.indexOf(socket),1);
		console.log('Disconnected : %s sockets connected',connections.length);
	});
	//send message
	socket.on('send message',function(data){
		//console.log(data);
		var msg=data;
		var uname=socket.username;
		var dataoutput=[{"uname":uname,"msg":msg}] ;
		
		io.sockets.emit('new message',dataoutput);
	});

	//new user
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username=data;
		users.push(socket.username);
		Updateusername();
	});

	function Updateusername(){
		io.sockets.emit('get users',users)
	}
})
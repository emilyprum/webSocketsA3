const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const socketIO  = require('socket.io')(server); //hello I am new

const LISTEN_PORT = 8080; //make sure greater than 3000. Some ports are reserved/blocked by firewall ...

app.use((express.static(__dirname + '/public'))); //set root dir to the public folder

//routes
app.get('/color', function(req,res) {
    res.sendFile(__dirname + '/public/color.html');
});

app.get('/controller', function(req,res) {
    res.sendFile(__dirname + '/public/controller.html');
});

//websocket stuff
socketIO.on('connection', function(socket) {
    console.log(socket.id + ' has connected!');

    socket.on('disconnect', function(data) {
        console.log(socket.id + ' has disconnected');
    });

    //custom events
    //socket = one client
    //socketIO.sockets = all clients

    // these are the functions that get passed.. this passes in the color
    socket.on('createTarget', function(data) {  
        console.log('createTarget');


        var xpos = Math.random() * (10 - 0) + 0;
        var ypos = Math.random() * (10 - (-5)) + (-5);
        var zpos = Math.random() * (40 - (-20)) + (-20);
        socketIO.sockets.emit('newTarget', {xpos, ypos, zpos});
        
    });

    socket.on('createFakeTarget', function(data) {  
        console.log('createFakeTarget');
        var xpos = Math.random() * (10 - 1) + 0;
        var ypos = Math.random() * (12 - (-3)) + (-3);
        var zpos = Math.random() * (40 - (-20)) + (-20);
        socketIO.sockets.emit('newFakeTarget', {xpos, ypos, zpos});
        
    });

    // passing 1 to the delete target function in controller
    socket.on('removeTarget', function(data) {  
        console.log('player has hit the target');
        socketIO.sockets.emit('addPoints', 1);
        
    });
});

//finally, start server
server.listen(LISTEN_PORT);
console.log('listening to port: ' + LISTEN_PORT);
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

var jf = require('./jsonutil.js');
var fs = require('fs');

var social = process.argv[2];
var port = process.argv[3];


users = [];
connections = [];
// var json = {
//     msgs: [],
//     usrs: []
// };

var json = jf.readFile('./socials/' + social + '.json');

app.use(express.static('public'));

server.listen(process.env.PORT || port || 3001);
console.log("started!");

// Disconnect
io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('getmsgs', data => {
        socket.emit('loadmsgs', json);
    });

    socket.on('disconnect', function() {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // Send Message
    socket.on('send message', function(data) {
        console.log(data);
        json.msgs.push(data);
        json.usrs.push(socket.username);
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    // New User
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    };
});

process.on('SIGINT', () => {
    jf.writeFile('./socials/' + social + '.json', json);
    process.exit(1);
})
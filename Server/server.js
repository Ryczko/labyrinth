const io = require('socket.io')(3000);

const users = {};

io.on('connection', (socket) => {

    if (Object.keys(users).length < 4) {
        socket.on('new-user', (name) => {
            users[socket.id] = name;
    
            console.log(users);
    
            socket.broadcast.emit('hello-message', name);
        });
    
        socket.on('send-new-message', (message) => {
            socket.broadcast.emit('chat-message', message);
        });
    
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', users[socket.id]);
            delete users[socket.id];
            
            console.log(users);
        });
    } else {
        const msg = 'osiągnięto limit graczy';
        console.log(msg);

        socket.emit('user-limit', msg);
    }
	
});

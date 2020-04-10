const io = require('socket.io')(3000)

const users = {};

//Object.keys(users).length

io.on('connection', socket => {

    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('hello-message', name);

        //if (Object.keys(users).length === 4) { }//tworzenie planszy
    });

    socket.on('send-new-message', message => {
        socket.broadcast.emit('chat-message', message)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

const io = require('socket.io')(3000);

const users = {};

let boardInfo = null;


io.on('connection', (socket) => {

    if (Object.keys(users).length < 4) {
        socket.on('new-user', (name) => {



            users[socket.id] = name;

            if (Object.keys(users).length === 1) {
                socket.emit('get-board', 'plansza');

            }
            else {

                socket.emit('create-board', boardInfo)

            }

            console.log(users)

            socket.broadcast.emit('hello-message', name);


        });

        socket.on('inicial-board', board => {

            boardInfo = board;
        })

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

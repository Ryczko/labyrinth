const io = require('socket.io')(3000);

const users = {};
let boardInfo = null;

io.on('connection', (socket) => {
	if (Object.keys(users).length < 4) {
		socket.on('new-user', (name) => {
			users[socket.id] = name;

			console.log(users);

			socket.broadcast.emit('hello-message', name);

			if (Object.keys(users).length === 1) {
				socket.emit('get-board');
			} else {
				socket.emit('create-board', boardInfo);
			}

			//start the game
			if (Object.keys(users).length === 2) {
				socket.emit('start-game', Object.keys(users).length);//zaczekaj
			}
		});

		socket.on('start-turn', (isPut) => {
			if (isPut) io.to(`${Object.keys(users)[0]}`).emit('players-move');
		})

		socket.on('put-element', putData => {
			socket.broadcast.emit('send-put-element', putData)
		})

		socket.on('init-board', (board) => {
			boardInfo = board;
		});

		socket.on('players-info', (playersInfo) => {
			const usersKeys = Object.keys(users);

			usersKeys.forEach((el, index) => {
				if (index !== usersKeys.length - 1) {
					const playerInfo = {
						colors: playersInfo.colors,
						cards: playersInfo.cards[index],
						allCards: playersInfo.cards
					}

					io.to(`${el}`).emit('players-start-data', (playerInfo));
				}
			});
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

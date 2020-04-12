import Board from './Board/Board.js';
// import Put from './Board/Put.js';
// import Start from './Start/Start.js';
// import { inicializeChat } from './Chat/chat.js';


import { newMessage } from './Chat/newMessage.js';


const socket = io('http://localhost:3000');
const chatForm = document.querySelector('.chat__form');
const messageInput = document.querySelector('.chat__form__input');

//emit - wysyła | on - odbiera

const name = prompt('twoje imie');
newMessage('bot', `Dołączyłeś do gry`);

socket.emit('new-user', name);

socket.on('hello-message', (name) => {
    newMessage('bot', `gracz ${name} dołącza do gry`);
});

socket.on('user-limit', (msg) => {
    alert(msg);
});
socket.on('user-disconnected', (name) => {
    newMessage('bot', `${name} wyszedł z gry`);
});







socket.on('get-board', data => {
    const playerBoard = new Board();

    const boardInfo = playerBoard.createNewBoard()

    socket.emit('inicial-board', boardInfo);
})


socket.on('create-board', board => {
    const playerBoard = new Board();

    playerBoard.copyBoard(board)

})














socket.on('chat-message', (message) => {
    const { name, text } = message;

    newMessage(name, text);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = messageInput.value;
    const message = {
        name: name,
        text: text
    };

    console.log(message);

    newMessage('You', text);

    socket.emit('send-new-message', message);

    messageInput.value = '';
});

// //map initialization
// const board = new Board();
// const put = new Put();
// inicializeChat();
// //argument = number of players
// const start = new Start(4, put);

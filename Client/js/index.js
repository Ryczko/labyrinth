import Board from "./Board/Board.js";
import Put from "./Board/Put.js";
import Start from "./Start/Start.js";
import { inicializeChat } from './Chat/chat.js'
import { newMessage } from './Chat/newMessage.js'


const socket = io('http://localhost:3000')
const chatForm = document.querySelector('.chat__form')
const messageInput = document.querySelector('.chat__form__input')

const name = prompt('twoje imie');
newMessage('bot', `Dołączyłeś do gry`)


socket.emit('new-user', name)


socket.on('hello-message', name => {
    newMessage('bot', `gracz ${name} dołącza do gry`)
})

//emit- wysyła on-odbiera
socket.on('chat-message', data => {
    newMessage(name, data)
})

socket.on('user-disconnected', name => {
    newMessage('bot', `${name} wyszedł z gry`)
})

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    newMessage('You', message)
    socket.emit('send-new-message', message)
    messageInput.value = '';
})









// //map initialization
// const board = new Board();
// const put = new Put();
// inicializeChat();
// //argument = number of players
// const start = new Start(4, put);



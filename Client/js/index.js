import Board from "./Board/Board.js";
import Put from "./Board/Put.js";
import Start from "./Start/Start.js";
import { createCards } from "./Cards/Cards.js";
import { newMessage } from "./Chat/newMessage.js";
import Player from "./Player/Player.js";

const socket = io("http://localhost:3000");
const chatForm = document.querySelector(".chat__form");
const messageInput = document.querySelector(".chat__form__input");

let put = null,
  playerBoard = null,
  start = null;

//users connecting and disconnecting

let name = prompt("twoje imie");

socket.emit("new-user", name);

socket.on("wrong-name", () => {
  name = prompt("twoje imie");
  socket.emit("new-user", name);
});

newMessage("bot", `Dołączyłeś do gry`);

socket.on("hello-message", (name) => {
  newMessage("bot", `gracz ${name} dołącza do gry`);
});

socket.on("user-limit", (msg) => {
  alert(msg);
});

socket.on("user-disconnected", (name) => {
  newMessage("bot", `${name} wyszedł z gry`);
});

//Board init and coping
socket.on("get-board", () => {
  playerBoard = new Board();
  const boardInfo = playerBoard.createNewBoard();
  socket.emit("init-board", boardInfo);
});

socket.on("create-board", (board) => {
  playerBoard = new Board();
  playerBoard.copyBoard(board);
});

//starting game

socket.on("start-game", (numberOfUsers) => {
  put = new Put();
  start = new Start(numberOfUsers, put);
  start.dealCards(start.playerNumber);

  start.createPlayers(numberOfUsers);

  createCards(start.allCards[start.allCards.length - 1]);
  const playersFields = [...document.querySelectorAll(".pawn")];

  const pawnColors = [];

  playersFields.forEach((el) => {
    pawnColors.push(el.style.background);
  });

  const playersInfo = {
    colors: pawnColors,
    cards: start.allCards,
  };

  socket.emit("players-info", playersInfo);
});

socket.on("players-start-data", (playerInfo) => {
  const { colors, cards, allCards } = playerInfo;

  put = new Put();
  start = new Start(colors.length, put);
  start.allCards = allCards;
  createCards(cards);

  start.createPlayers(colors.length, colors);

  socket.emit("start-turn", true);
});

//round menager

socket.on("players-move", () => {

  
  document
    .querySelector(".player__moving-field__arrow")
    .classList.remove("hide");

  put.addListeneres();
  start.playersArray[start.activePlayer].move(start.activePlayer);
});

socket.on("send-put-element", (putData) => {
  document.querySelector(".player__moving-field__arrow").classList.add("hide");
	console.log(putData)
  put.slide(putData);
  
});

socket.on("rotate", () => {
  playerBoard.movingField.rotateMovingField();
});

socket.on('move-player', data => {
  start.playersArray[data.id - 1].moveAnimation(data.path, data.id);

  if (start.activePlayer === start.playersArray.length - 1) start.activePlayer = 0;
  else start.activePlayer++;

 socket.emit('next-player', start.activePlayer);
 put.isMoved=false;
})

//chat
socket.on("chat-message", (message) => {
  const { name, text } = message;
  newMessage(name, text);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = messageInput.value;
  const message = {
    name: name,
    text: text,
  };

  newMessage("You", text);

  socket.emit("send-new-message", message);

  messageInput.value = "";
});

// //map initialization
// const board = new Board();
// const put = new Put();
// inicializeChat();
// //argument = number of players
// const start = new Start(4, put);

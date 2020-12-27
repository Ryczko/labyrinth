import Board from "./Board/Board.js";
import Put from "./Board/Put.js";
import Start from "./Start/Start.js";
import { createCards } from "./Cards/Cards.js";
import { newMessage } from "./Chat/newMessage.js";
import { startCounting } from "./Timer/timer.js";

const socket = io(window.location.origin);

const openChatButton = document.querySelector('.open-chat');
const chat = document.querySelector('.chat');

openChatButton.addEventListener('click', ()=>{
  chat.classList.toggle('opened');
})

const chatForm = document.querySelector(".chat__form"),
  messageInput = document.querySelector(".chat__form__input");

let put = null,
  playerBoard = null,
  start = null;

let name = prompt("twoje imie");

socket.emit("new-user", name, roomName);

socket.on("redirect-to-lobby", () => {
  window.location.replace("/");
});

socket.on("wrong-name", () => {
  name = prompt("Your name");
  socket.emit("new-user", name, roomName);
});

newMessage("bot", `You joined the game`);

socket.on("hello-message", (name) => {
  newMessage("bot", `The player ${name} joins the game`);
});

socket.on("user-limit", (msg) => {
  alert(msg);
});

socket.on("user-disconnected", (name) => {
  newMessage("bot", `${name} quit the game`);
});

//Board init and coping
socket.on("get-board", () => {
  playerBoard = new Board();
  const boardInfo = playerBoard.createNewBoard();
  socket.emit("init-board", boardInfo, roomName);
});

socket.on("create-board", (board) => {
  playerBoard = new Board();
  playerBoard.copyBoard(board);
});

socket.on("start-time", () => {
  startCounting();
});

//starting game
socket.on("start-game", (numberOfUsers, usersNames) => {
  put = new Put();
  start = new Start(numberOfUsers, put, usersNames);
  playerBoard.movingField.addMovingField();
  start.dealCards(start.playerNumber);

  start.createPlayers(numberOfUsers);

  createCards(start.allCards[0]);
  const playersFields = [...document.querySelectorAll(".pawn")];

  const pawnColors = [];

  playersFields.forEach((el) => {
    pawnColors.push(el.style.background);
  });

  const playersInfo = {
    colors: pawnColors,
    cards: start.allCards,
    usersNames,
  };

  socket.emit("players-info", playersInfo, roomName);
});

socket.on("players-start-data", (playerInfo) => {
  const { colors, cards, allCards, usersNames } = playerInfo;
  playerBoard.movingField.addMovingField();
  put = new Put();
  start = new Start(colors.length, put, usersNames);
  start.allCards = allCards;
  createCards(cards);

  start.createPlayers(colors.length, colors);
});

//game menager
socket.on("players-move", () => {
  document
    .querySelector(".player__moving-field__arrow")
    .classList.remove("hide");

  put.addListeneres();
  start.playersArray[start.activePlayer].move(start.activePlayer);
});

socket.on("send-put-element", (putData) => {
  document.querySelector(".player__moving-field__arrow").classList.add("hide");
  put.slide(putData);
  put.isMoved = true;
});

socket.on("rotate", () => {
  playerBoard.movingField.rotateMovingField();
});

socket.on("move-player", (data) => {
  start.playersArray[data.id - 1].moveAnimation(data.path, data.id);
});

socket.on("change-player", (names, firstMove = false) => {
  document.querySelector(".player__moving-field__arrow").classList.add("hide");

  if (names[start.activePlayer] === name && !firstMove) {
    put.isMoved = true;
    start.playersArray[start.activePlayer].removeListeners();
    put.removeListeners();
  }

  if (firstMove) start.activePlayer = -1;
  if (start.activePlayer === start.playersArray.length - 1)
    start.activePlayer = 0;
  else start.activePlayer++;

  if (names[start.activePlayer] === name) {
    newMessage(
      "Bot",
      "Your turn",
      start.playersArray[start.activePlayer].playerSkin
    );

    socket.emit("active-player", {
      activePlayer: start.activePlayer,
      room: roomName,
    });
  } else {
    newMessage(
      "Bot",
      `Player ${names[start.activePlayer]} turn`,
      start.playersArray[start.activePlayer].playerSkin
    );
  }

  put.isMoved = false;
});

socket.on("delete-treasure", (collected) => {
  const { id, message, treasure } = collected;
  newMessage("Bot", message);

  start.playersArray.forEach((el) => {
    if (el.cards[el.cards.length - 1] === treasure) el.changeCard(el.cards);
  });
});

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

  socket.emit("send-new-message", message, roomName);

  messageInput.value = "";
});

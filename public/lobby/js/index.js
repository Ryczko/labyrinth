const socket = io(window.location.origin);

const roomContainer = document.querySelector(".active-rooms");
socket.on("room-created", (data) => {
  const roomElement = document.createElement("div");
  roomElement.dataset.roomname = data.roomName;
  roomElement.innerText = data.roomName;
  roomElement.classList.add("active-rooms__room");
  const roomLink = document.createElement("a");
  roomLink.href = `/${data.roomName}`;
  roomLink.innerText = "join";

  const playersInfo = document.createElement("h4");
  playersInfo.innerHTML = `Players: 
  <span class="active-rooms__active-players">0</span>/
  <span class="active-rooms__max-players">${data.numberOfPlayers}</span>`;
  roomElement.appendChild(playersInfo);
  roomElement.appendChild(roomLink);
  roomContainer.appendChild(roomElement);
});

socket.on("change-players-number", (roomInfo) => {
  const room = document.querySelector(
    `.active-rooms__room[data-roomName="${roomInfo.roomName}"]`
  );
  const activePlayersSpan = room.querySelector(`.active-rooms__active-players`);
  activePlayersSpan.innerText = roomInfo.activePlayers;

  if (+roomInfo.activePlayers === +roomInfo.maxPlayers) {
    const joinBtn = room.querySelector("a");
    joinBtn.remove();
    const gameInProgress = document.createElement("div");
    gameInProgress.innerText = "Game in progress";
    room.appendChild(gameInProgress);
  }
});

socket.on("delete-room", (roomName) => {
  const room = document.querySelector(
    `.active-rooms__room[data-roomName="${roomName}"]`
  );

  if (room) room.remove();
});

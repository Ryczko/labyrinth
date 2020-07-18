const express = require("express");
const path = require("path");
const Rooms = require("./models/rooms");
const lobbyRoutes = require("./routes/lobby");

const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(lobbyRoutes);

PORT = process.env.PORT || 3000;

server.listen(PORT);

//let time = 30,
//timeIterval;

io.on("connection", (socket) => {
  // const resetTime = () => {
  //   time = 30;
  //   clearInterval(timeIterval);
  // };

  // const changeTime = () => {
  //   time--;
  //   if (time === 0) {
  //     io.emit("change-player", Object.values(users));
  //     resetTime();
  //   }
  // };

  socket.on("new-user", (name, room) => {
    if (Rooms.getRoom(room) == null) {
      return socket.emit("redirect-to-lobby");
    }
    if (name !== "" && name != null) {
      socket.join(room);
      Rooms.addPlayerToRoom(room, socket.id, name);

      io.emit("change-players-number", {
        roomName: room,
        maxPlayers: Rooms.getRoom(room).numberOfPlayers,
        activePlayers: Object.keys(Rooms.getRoom(room).users).length,
      });
      socket.to(room).broadcast.emit("hello-message", name);
    } else {
      return socket.emit("wrong-name");
    }

    if (Rooms.getRoom(room).boardInfo == null) {
      io.to(Object.keys(Rooms.getRoom(room).users)[0]).emit("get-board");
    } else {
      io.to(room).emit("create-board", Rooms.getRoom(room).boardInfo);
    }

    //start the game
    if (
      Object.keys(Rooms.getRoom(room).users).length ===
      +Rooms.getRoom(room).numberOfPlayers
    ) {
      io.to(Object.keys(Rooms.getRoom(room).users)[0]).emit(
        "start-game",
        +Rooms.getRoom(room).numberOfPlayers,
        Object.values(Rooms.getRoom(room).users)
      );
      Rooms.fullRoom(room);
    }
  });

  socket.on("put-element", (putData, room) => {
    socket.to(room).broadcast.emit("send-put-element", putData);
  });

  socket.on("rotate-element", (room) => {
    console.log("wykonaj");
    socket.to(room).broadcast.emit("rotate");
  });

  socket.on("init-board", (board, room) => {
    Rooms.getRoom(room).boardInfo = board;
  });

  socket.on("players-info", (playersInfo, room) => {
    const usersKeys = Object.keys(Rooms.getRoom(room).users);

    usersKeys.forEach((el, index) => {
      if (index !== 0) {
        const playerInfo = {
          colors: playersInfo.colors,
          cards: playersInfo.cards[index],
          allCards: playersInfo.cards,
          usersNames: playersInfo.usersNames,
        };

        socket.to(el).broadcast.emit("players-start-data", playerInfo);
      }
    });
    io.to(room).emit(
      "change-player",
      Object.values(Rooms.getRoom(room).users),
      true
    );
    io.to(`${Object.keys(Rooms.getRoom(room).users)[0]}`).emit("players-move");
  });

  socket.on("active-player", (data) => {
    io.to(
      `${Object.keys(Rooms.getRoom(data.room).users)[data.activePlayer]}`
    ).emit("players-move");
    //timeIterval = setInterval(changeTime, 1000);
    //io.emit("start-time");
  });

  socket.on("move-animation", (data, room) => {
    socket.to(room).broadcast.emit("move-player", data);
    socket
      .to(room)
      .broadcast.emit(
        "change-player",
        Object.values(Rooms.getRoom(room).users)
      );

    const usersKeys = Object.keys(Rooms.getRoom(room).users);
    if (data.id === usersKeys.length) data.id = 0;

    //resetTime();
    io.to(usersKeys[data.id]).emit("players-move");
  });

  socket.on("leave-move", (id, room) => {
    //resetTime();
    socket
      .to(room)
      .broadcast.emit(
        "change-player",
        Object.values(Rooms.getRoom(room).users)
      );
  });

  socket.on("send-new-message", (message, room) => {
    socket.to(room).broadcast.emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    getUserRooms(socket).forEach((room) => {
      socket
        .to(room)
        .broadcast.emit(
          "user-disconnected",
          Rooms.getRoom(room).users[socket.id]
        );

      Rooms.removePlayer(room, socket.id);

      const usersKeys = Object.keys(Rooms.getRoom(room).users);

      io.emit("change-players-number", {
        roomName: room,
        maxPlayers: Rooms.getRoom(room).numberOfPlayers,
        activePlayers: usersKeys.length,
      });

      if (usersKeys.length === 1 && Rooms.getRoom(room).isFull) {
        io.to(usersKeys[0]).emit("chat-message", {
          name: "Bot",
          text: "All players have left the game, you won!",
        });
      }

      if (usersKeys.length === 0) {
        io.emit("delete-room", room);
        Rooms.removeRoom(room);
      }
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(Rooms.getAllRooms()).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

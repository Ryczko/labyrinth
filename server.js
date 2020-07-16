const express = require("express");
const path = require("path");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const rooms = { room1: { users: {}, numberOfPlayers: 2 } };

app.get("/", (req, res) => {
  res.render("lobby", { rooms: rooms });
});

app.post("/room", (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect("/");
  }

  rooms[req.body.room] = {
    users: {},
    numberOfPlayers: req.body.numberOfPlayers,
  };

  res.redirect(req.body.room);
  //wyslij ze pokoj stworzony
});

app.get("/:room", (req, res) => {
  const roomInfoIndex = Object.keys(rooms).indexOf(req.params.room);
  const roomInfo = Object.values(rooms)[roomInfoIndex];
  if (roomInfo) {
    res.render("game", {
      roomName: req.params.room,
      numberOfPlayers: roomInfo.numberOfPlayers,
      boardInfo: null,
    });
  } else {
    res.redirect("/");
  }
});

server.listen(3000);

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
    if (name !== "" && name != null) {
      socket.join(room);
      rooms[room].users[socket.id] = name;
      socket.to(room).broadcast.emit("hello-message", name);
    } else {
      return socket.emit("wrong-name");
    }

    if (rooms[room].boardInfo == null) {
      io.to(Object.keys(rooms[room].users)[0]).emit("get-board");
    } else {
      io.to(room).emit("create-board", rooms[room].boardInfo);
    }

    //start the game
    if (
      Object.keys(rooms[room].users).length === +rooms[room].numberOfPlayers
    ) {
      console.log("startuje");
      io.to(Object.keys(rooms[room].users)[0]).emit(
        "start-game",
        +rooms[room].numberOfPlayers,
        Object.values(rooms[room].users)
      );
    }
  });

  socket.on("put-element", (putData, room) => {
    socket.to(room).broadcast.emit("send-put-element", putData);
  });
  socket.on("rotate-element", (room) => {
    socket.to(room).broadcast.emit("rotate");
  });

  socket.on("init-board", (board, room) => {
    rooms[room].boardInfo = board;
  });

  socket.on("players-info", (playersInfo, room) => {
    const usersKeys = Object.keys(rooms[room].users);

    usersKeys.forEach((el, index) => {
      if (index !== 0) {
        const playerInfo = {
          colors: playersInfo.colors,
          cards: playersInfo.cards[index],
          allCards: playersInfo.cards,
          usersNames: playersInfo.usersNames,
        };

        console.log(playerInfo.cards);

        socket.to(el).broadcast.emit("players-start-data", playerInfo);
      }
    });
    io.to(room).emit("change-player", Object.values(rooms[room].users), true);
    io.to(`${Object.keys(rooms[room].users)[0]}`).emit("players-move");
  });

  socket.on("active-player", (data) => {
    io.to(`${Object.keys(rooms[data.room].users)[data.activePlayer]}`).emit(
      "players-move"
    );
    //timeIterval = setInterval(changeTime, 1000);
    //io.emit("start-time");
  });

  socket.on("move-animation", (data, room) => {
    socket.to(room).broadcast.emit("move-player", data);
    socket
      .to(room)
      .broadcast.emit("change-player", Object.values(rooms[room].users));

    const usersKeys = Object.keys(rooms[room].users);
    if (data.id === usersKeys.length) data.id = 0;

    //resetTime();
    io.to(usersKeys[data.id]).emit("players-move");
  });

  socket.on("leave-move", (id, room) => {
    //resetTime();
    socket
      .to(room)
      .broadcast.emit("change-player", Object.values(rooms[room].users));
  });

  // socket.on("collect-treasure", (collected,room) => {
  //   socket.broadcast.emit("delete-treasure", collected);
  // });

  socket.on("send-new-message", (message, room) => {
    socket.to(room).broadcast.emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    getUserRooms(socket).forEach((room) => {
      socket
        .to(room)
        .broadcast.emit("user-disconnected", rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

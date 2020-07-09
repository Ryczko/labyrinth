const express = require("express");
const path = require('path');

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const rooms = { room1: {} };

app.get("/", (req, res) => {
  res.render("lobby", { rooms: rooms });
});

app.post("/room", (req, res) => {
  rooms[req.body.room] != null && res.redirect('/');
  
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room);
  //wyslij ze pokoj stworzony
})

app.get("/:room", (req, res) => {
  res.render("game", { roomName: req.params.room });
});

server.listen(3000);

const users = {};

let activePlayer,
  boardInfo = null;

let time = 30,
  timeIterval;

io.on("connection", (socket) => {
  if (Object.keys(users).length < 4) {
    const resetTime = () => {
      time = 30;
      clearInterval(timeIterval);
    };

    const changeTime = () => {
      time--;
      if (time === 0) {
        io.emit("change-player", Object.values(users));
        resetTime();
      }
    };

    socket.on("new-user", (name) => {
      if (name == null) name = "";
      if (name !== "") {
        users[socket.id] = name;
        socket.broadcast.emit("hello-message", name);
      } else {
        return socket.emit("wrong-name");
      }

      console.log(users);

      if (Object.keys(users).length === 1) {
        socket.emit("get-board");
      } else {
        socket.emit("create-board", boardInfo);
      }

      //start the game
      if (Object.keys(users).length === 2) {
        socket.emit("start-game", Object.keys(users).length);
      }
    });

    socket.on("put-element", (putData) => {
      socket.broadcast.emit("send-put-element", putData);
    });
    socket.on("rotate-element", () => {
      socket.broadcast.emit("rotate");
    });

    socket.on("init-board", (board) => {
      boardInfo = board;
    });

    socket.on("players-info", (playersInfo) => {
      const usersKeys = Object.keys(users);

      usersKeys.forEach((el, index) => {
        if (index !== usersKeys.length - 1) {
          const playerInfo = {
            colors: playersInfo.colors,
            cards: playersInfo.cards[index],
            allCards: playersInfo.cards,
          };

          io.to(`${el}`).emit("players-start-data", playerInfo);
        }
      });
      io.emit("change-player", Object.values(users), true);
      io.to(`${Object.keys(users)[0]}`).emit("players-move");
    });

    socket.on("active-player", (activeP) => {
      activePlayer = activeP;
      io.to(`${Object.keys(users)[activePlayer]}`).emit("players-move");
      timeIterval = setInterval(changeTime, 1000);
      io.emit("start-time");
    });

    socket.on("move-animation", (data) => {
      socket.broadcast.emit("move-player", data);
      socket.broadcast.emit("change-player", Object.values(users));

      const usersKeys = Object.keys(users);
      if (data.id === usersKeys.length) data.id = 0;

      resetTime();
      io.to(usersKeys[data.id]).emit("players-move");
    });

    socket.on("leave-move", (id) => {
      resetTime();
      socket.broadcast.emit("change-player", Object.values(users));
    });

    socket.on("collect-treasure", (collected) => {
      socket.broadcast.emit("delete-treasure", collected);
    });

    socket.on("send-new-message", (message) => {
      socket.broadcast.emit("chat-message", message);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", users[socket.id]);

      delete users[socket.id];

      console.log(users);
    });
  } else {
    const msg = "osiągnięto limit graczy";

    socket.emit("user-limit", msg);
  }
});

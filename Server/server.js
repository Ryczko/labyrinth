const io = require("socket.io")(3000);

const users = {};
let boardInfo = null;

io.on("connection", (socket) => {
  if (Object.keys(users).length < 4) {
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
        socket.emit("start-game", Object.keys(users).length); //zaczekaj
      }
    });

    socket.on("start-timer", () => {
      io.emit("start-counting");
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

    socket.on("stop-counting", () => {
      socket.broadcast.emit("change-player", Object.values(users));
    });

    socket.on("move-animation", (data) => {
      console.log(users);
      socket.broadcast.emit("move-player", data);
      socket.broadcast.emit("change-player", Object.values(users));

      const usersKeys = Object.keys(users);

      if (data.id === usersKeys.length) data.id = 0;

      io.to(usersKeys[data.id]).emit("players-move");
    });

    socket.on("leave-move", (id) => {
      socket.broadcast.emit("change-player", Object.values(users));

      const usersKeys = Object.keys(users);
      if (id === usersKeys.length) id = 0;

      io.to(usersKeys[id]).emit("players-move");
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

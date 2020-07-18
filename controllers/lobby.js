const Rooms = require("../models/rooms");

exports.getHome = (req, res) => {
  res.render("lobby", { rooms: Rooms.getAllRooms() });
};

exports.checkDeleteRoom = (room, req) => {
  if (!Rooms.getRoom(room)) return;
  if (Object.keys(Rooms.getRoom(room).users).length === 0) {
    req.io.emit("delete-room", room);
    Rooms.removeRoom(room);
  }
};

exports.postRoom = (req, res) => {
  const { room, numberOfPlayers } = req.body;
  if (Rooms.getRoom(room) != null) return res.redirect("/");

  Rooms.addNewRoom(room, numberOfPlayers);
  res.redirect(room);
  req.io.emit("room-created", {
    ...Rooms.getRoom(room),
    roomName: room,
  });

  setTimeout(() => this.checkDeleteRoom(room, req), 60000);
};

exports.getUniqueRoom = (req, res) => {
  const { room } = req.params;
  const roomInfo = Rooms.getAllRooms()[room];

  if (roomInfo) {
    if (roomInfo.isFull) return res.redirect("/");
    res.render("game", {
      roomName: room,
      numberOfPlayers: roomInfo.numberOfPlayers,
      boardInfo: null,
    });
  } else {
    res.redirect("/");
  }
};

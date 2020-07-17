const Rooms = require("../models/rooms");

exports.getHome = (req, res) => {
  res.render("lobby", { rooms: Rooms.getAllRooms() });
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
};

exports.getUniqueRoom = (req, res) => {
  const { room } = req.params;
  const roomInfo = Rooms.getAllRooms()[room];

  if (roomInfo) {
    res.render("game", {
      roomName: room,
      numberOfPlayers: roomInfo.numberOfPlayers,
      boardInfo: null,
    });
  } else {
    res.redirect("/");
  }
};

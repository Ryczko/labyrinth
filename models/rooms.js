const rooms = { room1: { users: {}, numberOfPlayers: 2 } };

module.exports = class Rooms {
  static addNewRoom(roomName, numberOfPlayers) {
    rooms[roomName] = {
      users: {},
      numberOfPlayers,
    };
  }
  static addPlayerToRoom(roomName, socketId, userName) {
    rooms[roomName].users[socketId] = userName;
  }
  static getRoom(roomName) {
    return rooms[roomName];
  }

  static removePlayer(roomName, socketId) {
    delete rooms[roomName].users[socketId];
  }
  static getAllRooms() {
    return rooms;
  }
};

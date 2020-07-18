const rooms = {};

module.exports = class Rooms {
  static addNewRoom(roomName, numberOfPlayers) {
    rooms[roomName] = {
      users: {},
      numberOfPlayers,
      isFull: false,
    };
  }

  static removeRoom(roomName) {
    delete rooms[roomName];
  }

  static fullRoom(roomName) {
    rooms[roomName].isFull = true;
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

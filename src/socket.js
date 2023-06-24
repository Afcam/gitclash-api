const { Server } = require('socket.io');
const ioAuth = require('./middleware/ioAuth');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(ioAuth.verifyToken);

  io.on('connection', (socket) => {
    const roomUUID = socket.decoded.room_uuid;
    const playerUUID = socket.decoded.player_uuid;
    console.log('connect', playerUUID);

    socket.join(roomUUID);
    io.to(roomUUID).emit('joinedRoom', {
      title: 'Commit',
      username: playerUUID,
      message: 'Joined the room',
      timestamp: new Date(),
      room_id: roomUUID,
    });

    io.to(roomUUID).emit('activities', {
      title: 'Commit',
      username: playerUUID,
      message: 'Joined the room',
      timestamp: new Date(),
      room_id: roomUUID,
    });
    io.to(roomUUID).emit('newPlayer', playerUUID);

    socket.on('disconnect', () => {
      console.log('disconnected', playerUUID);
    });
  });
};

module.exports = { initSocket };

// io.on('connection', (socket) => {
//   // Player joins a room
//   socket.on('joinRoom', (roomName) => {
//     // Create a new room if it doesn't exist
//     if (!rooms[roomName]) {
//       rooms[roomName] = {
//         players: [],
//       };
//     }

//     // Add the player to the room
//     rooms[roomName].players.push(socket.id);
//     socket.join(roomName);

//     // Notify the player that they have successfully joined the room
//     socket.emit('joinedRoom', roomName);
//     console.log(rooms);
//   });

//   // Player sends a command in their room
//   socket.on('sendCommand', (data) => {
//     const { roomName, command } = data;

//     // Broadcast the command to all players in the room except the sender
//     socket.to(roomName).emit('receivedCommand', command);
//   });

//   // Player disconnects from the server
//   socket.on('disconnect', () => {
//     // Find the room the player is in and remove them
//     for (const roomName in rooms) {
//       const room = rooms[roomName];
//       const playerIndex = room.players.indexOf(socket.id);

//       if (playerIndex !== -1) {
//         room.players.splice(playerIndex, 1);
//         break;
//       }
//     }
//   });
// });

const { Server } = require('socket.io');
const ioAuth = require('./middleware/httpAuth');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization'],
    },
  });

  io.use(ioAuth.verifyToken);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      console.log(`Client joined room: ${roomName}`);
    });

    socket.on('message', (message) => {
      // Handle received message
      // Example: Broadcast the message to all clients in the room
      io.to(message.roomName).emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
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

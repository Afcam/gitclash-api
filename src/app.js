const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();

//paths for the basic routes
const roomRoutes = require('./routes/rooms-routes');

// Create the http server
const httpServer = createServer(app);

// Store room information
const rooms = {};

// Configure Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
  },
});

// Normal express config defaults
app.use(cors());
app.use(express.json());

// io.on('connection', (socket) => {
//   console.log('user Connected', socket.id);

//   socket.on('send_message', (data) => {
//     socket.broadcast.emit('receive_message', data);
//     console.log(data);
//   });
// });

io.on('connection', (socket) => {
  // Player joins a room
  socket.on('joinRoom', (roomName) => {
    // Create a new room if it doesn't exist
    if (!rooms[roomName]) {
      rooms[roomName] = {
        players: [],
      };
    }

    // Add the player to the room
    rooms[roomName].players.push(socket.id);
    socket.join(roomName);

    // Notify the player that they have successfully joined the room
    socket.emit('joinedRoom', roomName);
    console.log(rooms);
  });

  // Player sends a command in their room
  socket.on('sendCommand', (data) => {
    const { roomName, command } = data;

    // Broadcast the command to all players in the room except the sender
    socket.to(roomName).emit('receivedCommand', command);
  });

  // Player disconnects from the server
  socket.on('disconnect', () => {
    // Find the room the player is in and remove them
    for (const roomName in rooms) {
      const room = rooms[roomName];
      const playerIndex = room.players.indexOf(socket.id);

      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        break;
      }
    }
  });
});

// Middleware
// app.use(authMiddleware);

// Routes
app.use('/api/rooms', roomRoutes);

module.exports = { httpServer, io };

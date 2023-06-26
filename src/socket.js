const { Server } = require('socket.io');
const ioAuth = require('./middleware/ioAuth');
const { handlePlayCard, handleStartGame } = require('./sockets/game');
const { fetchPlayers, updatePlayerOnlineStatus } = require('./models/playerRepository');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication
  io.use(ioAuth.verifyToken);

  io.on('connection', async (socket) => {
    try {
      socket.join(socket.decoded.room_uuid);
      socket.join(socket.decoded.player_uuid);

      await updatePlayerOnlineStatus(socket.decoded.player_uuid, true);

      // Get all players for the room
      const players = await fetchPlayers(socket.decoded.room_uuid);
      const player = players.find((player) => player.player_uuid === socket.decoded.player_uuid);

      io.to(socket.decoded.room_uuid).emit('players', players);

      io.to(socket.decoded.room_uuid).emit('joined', {
        title: 'Join',
        username: player.username,
        message: 'Joined the room',
        avatar: player.avatar,
        timestamp: new Date(),
      });

      io.to(socket.id).emit('currentPlayer', {
        room_uuid: socket.decoded.room_uuid,
        username: player.username,
        avatar: player.avatar,
      });

      socket.on('playCard', (card) => {
        handlePlayCard(socket, card, io);
      });

      socket.on('start', () => {
        handleStartGame(socket, io);
      });

      socket.on('disconnect', async () => {
        await updatePlayerOnlineStatus(socket.decoded.player_uuid, false);

        const players = await fetchPlayers(socket.decoded.room_uuid);
        io.to(socket.decoded.room_uuid).emit('players', players);

        io.to(socket.decoded.room_uuid).emit('left', {
          title: 'Left',
          username: player.username,
          message: 'Left the room',
          avatar: player.avatar,
          timestamp: new Date(),
        });
      });
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = { initSocket };

const { Server } = require('socket.io');
const ioAuth = require('./middleware/ioAuth');
const knex = require('knex')(require('../knexfile'));

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(ioAuth.verifyToken);

  io.on('connection', async (socket) => {
    const roomUUID = socket.decoded.room_uuid;
    const playerUUID = socket.decoded.player_uuid;

    try {
      socket.join(roomUUID);

      const player = await knex('players').where('players.uuid', playerUUID).limit(1);

      if (player.length === 0) {
        socket.disconnect();
      }

      socket.broadcast.to(roomUUID).emit('action', {
        title: 'Joined',
        room_id: roomUUID,
        username: player[0].username,
        message: 'Joined the room',
        timestamp: new Date(),
      });

      socket.on('gameState', () => {
        io.to(roomUUID).emit('gameState', { message: 'something' });
      });

      socket.on('disconnect', () => {
        socket.broadcast.to(roomUUID).emit('action', {
          title: 'Left',
          room_id: roomUUID,
          username: player[0].username || '',
          message: 'Left the room',
          timestamp: new Date(),
        });
      });
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = { initSocket };

const { Server } = require('socket.io');
const ioAuth = require('./middleware/ioAuth');
const { handlePlayCard, handleStartGame } = require('./sockets/game');
const knex = require('knex')(require('../knexfile'));

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
      console.log('A user connected', socket.id, socket.decoded.player_uuid);

      socket.join(socket.decoded.room_uuid);
      socket.join(socket.decoded.player_uuid);

      const player = await knex('players')
        .where('players.uuid', socket.decoded.player_uuid)
        .limit(1);

      io.to(socket.decoded.room_uuid).emit('joined', {
        title: 'Join',
        username: player[0].username,
        message: 'Joined the room',
        avatar: player[0].avatar,
        timestamp: new Date(),
      });

      io.to(socket.id).emit('currentPlayer', {
        room_uuid: socket.decoded.room_uuid,
        username: player[0].username,
        avatar: player[0].avatar,
      });

      socket.on('playCard', (card) => {
        handlePlayCard(socket, card, io);
      });

      socket.on('start', () => {
        handleStartGame(socket, io);
      });

      socket.on('disconnect', () => {
        io.to(socket.decoded.room_uuid).emit('left', {
          title: 'Left',
          username: player[0].username,
          message: 'left the room',
          avatar: player[0].avatar,
          timestamp: new Date(),
        });
      });
    } catch (error) {
      console.log(error);
    }
  });
};

//   io.on('connection', async (socket) => {
//     try {
//       const roomUUID = socket.decoded.room_uuid;
//       const playerUUID = socket.decoded.player_uuid;

//       const player = await knex('players').where('players.uuid', playerUUID).limit(1);

//       // Receive initial game states from the server
//       socket.on('drawpile', (drawpile) => {
//         // Update the drawpile on the client-side
//       });

//       // Receive initial game states from the server
//       socket.on('drawpile', (drawpile) => {
//         // Update the drawpile on the client-side
//       });

//       socket.on('playedCards', (playedCards) => {
//         // Emit initial game states to the connected user
//         socket.emit('drawpile', drawpile);
//         socket.emit('playedCards', playedCards);
//         socket.emit('nextPlayer', nextPlayer);
//         // Update the played cards on the client-side
//       });

//       socket.on('nextPlayer', (nextPlayer) => {
//         // Update the next player on the client-side
//       });

//       socket.join(roomUUID);

//       if (player.length === 0) {
//         socket.disconnect();
//       }

//       socket.broadcast.to(roomUUID).emit('action', {
//         title: 'Joined',
//         room_id: roomUUID,
//         username: player[0].username,
//         message: 'Joined the room',
//         timestamp: new Date(),
//       });

//       socket.on('gameState', () => {
//         io.to(roomUUID).emit('gameState', { message: 'something' });
//       });

//       socket.on('disconnect', () => {
//         socket.broadcast.to(roomUUID).emit('action', {
//           title: 'Left',
//           room_id: roomUUID,
//           username: player[0].username || '',
//           message: 'Left the room',
//           timestamp: new Date(),
//         });
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   });
// };

module.exports = { initSocket };

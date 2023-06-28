const { Server } = require('socket.io');
const ioAuth = require('./middleware/ioAuth');
const { handlePlayCard, handleStartGame, handleDrawCard } = require('./sockets/game');
const { fetchPlayers, updatePlayerOnlineStatus } = require('./models/playerRepository');
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
      socket.join(socket.decoded.room_uuid);
      socket.join(socket.decoded.player_uuid);

      await updatePlayerOnlineStatus(socket.decoded.player_uuid, true);

      // Get all players for the room
      const players = await fetchPlayers(socket.decoded.room_uuid);
      const player = players.find((player) => player.player_uuid === socket.decoded.player_uuid);

      socket.on('getPlayersCards', async () => {
        //  TODO: make return the amount of cards

        io.to(socket.id).emit('playersCards', players);
      });
      io.to(socket.decoded.room_uuid).emit('players', players);

      socket.on('getPlayers', () => {
        io.to(socket.id).emit('players', players);
      });
      io.to(socket.decoded.room_uuid).emit('players', players);

      io.to(socket.decoded.room_uuid).emit('joined', {
        title: 'Join',
        username: player.username,
        message: 'Joined the room',
        avatar: player.avatar,
        timestamp: new Date(),
      });

      const currentPlayer = {
        player_uuid: socket.decoded.player_uuid,
        room_uuid: socket.decoded.room_uuid,
        username: player.username,
        avatar: player.avatar,
      };

      socket.on('getCurrentPlayer', () => {
        io.to(socket.id).emit('currentPlayer', currentPlayer);
      });

      socket.on('playCard', (message) => {
        handlePlayCard(socket, message.card, io);
      });
      socket.on('drawCard', () => {
        handleDrawCard(socket, io);
      });

      socket.on('start', () => {
        handleStartGame(socket, io);
      });

      socket.on('getPlayersInfo', async () => {
        const playersInfo = [];
        for (const player of players) {
          const playerCards = await knex('players')
            .join('room_cards', 'room_cards.player_id', 'players.id')
            .join('cards', 'cards.id', 'room_cards.card_id')
            .where('players.uuid', player.player_uuid)
            .select('cards.type', 'cards.action', 'cards.comment', 'room_cards.id');

          playersInfo.push({
            player_uuid: player.player_uuid,
            cards: playerCards.length,
            avatar: player.avatar,
            username: player.username,
          });
        }
        io.to(socket.decoded.room_uuid).emit('playersInfo', playersInfo);
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

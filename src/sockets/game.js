const knex = require('knex')(require('../../knexfile'));

const { createNewGame } = require('../game/new-game');
const { fetchPlayers } = require('../models/playerRepository');

const handlePlayCard = async (socket, card, io) => {
  try {
    const players = await fetchPlayers(socket.decoded.room_uuid);
    let nextPlayerIndex = players.findIndex((p) => p.player_uuid === socket.decoded.player_uuid);
    nextPlayerIndex = nextPlayerIndex + 1 === players.length ? 0 : nextPlayerIndex + 1;

    io.to(socket.decoded.room_uuid).emit('nextPlayer', {
      player_uuid: players[nextPlayerIndex].player_uuid,
    });

    io.emit('cardPlayed', { player_uuid: socket.decoded.player_uuid, card });
  } catch (error) {
    console.log(error);
  }
};

function handleDrawCard(socket, io) {
  // io.emit('cardPlayed', { player_uuid: socket.decoded.player_uuid, card });
}
const handleStartGame = async (socket, io) => {
  try {
    await createNewGame(socket.decoded.room_uuid);

    // Get all player for the Room
    const players = await knex('rooms')
      .join('players', 'players.room_id', 'rooms.id')
      .where('rooms.uuid  ', socket.decoded.room_uuid)
      .select('players.uuid as player_uuid');

    // Pick the first player by random
    const firsPlayer = Math.floor(Math.random() * players.length);
    io.to(socket.decoded.room_uuid).emit('nextPlayer', {
      player_uuid: players[firsPlayer].player_uuid,
    });

    // Send the to each Player their cards
    const playersInfo = [];
    for (const player of players) {
      const playerCards = await knex('players')
        .join('room_cards', 'room_cards.player_id', 'players.id')
        .join('cards', 'cards.id', 'room_cards.card_id')
        .where('players.uuid', player.player_uuid)
        .select('cards.type', 'cards.action', 'cards.comment', 'room_cards.id');

      io.to(player.player_uuid).emit('handCards', playerCards);
      playersInfo.push({ player_uuid: player.player_uuid, cards: playerCards.length });
    }
    io.to(socket.decoded.room_uuid).emit('players', playersInfo);

    // Add draw and played
    const drawPile = await knex('rooms')
      .where('rooms.uuid', socket.decoded.room_uuid)
      .join('room_cards', 'room_cards.room_id', 'rooms.id')
      .where('room_cards.player_id', null);
    io.to(socket.decoded.room_uuid).emit('drawPile', drawPile.length);

    io.to(socket.decoded.room_uuid).emit('started');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handlePlayCard,
  handleStartGame,
  handleDrawCard,
};

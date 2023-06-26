const knex = require('knex')(require('../../knexfile'));

const { createNewGame } = require('../game/new-game');

function handlePlayCard(socket, card, io) {
  io.emit('cardPlayed', { player_uuid: socket.decoded.player_uuid, card });
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
        .select('cards.type', 'cards.action', 'cards.comment');

      io.to(player.player_uuid).emit('handCards', playerCards);
      playersInfo.push({ player_uuid: player.player_uuid, cards: playerCards.length });
    }

    io.to(socket.decoded.room_uuid).emit('players', playersInfo);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handlePlayCard,
  handleStartGame,
};

// Fetch all cards and than filter them
// const cards = await knex('rooms')
// .where('rooms.uuid  ', socket.decoded.room_uuid)
// .join('room_cards', 'room_cards.room_id', 'rooms.id')
// .join('players', 'players.id', 'room_cards.player_id');
// console.log(cards);

// // Check if it's the current player's turn
// if (socket.id === players[currentPlayerIndex]) {
//   // Process the played card and update game state
//   playedCards.push(card);

//   // Emit the played card to all connected players
// }
// // Move to the next player
// currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

// // Emit the next player's turn to all connected players
// io.emit('currentPlayer', players[currentPlayerIndex]);

//     // Define an empty array to store the played cards
// let playedCards = [];

// // Define an array of connected players
// let players = [];

// // Define a variable to keep track of the current player's turn
// let currentPlayerIndex = 0;

// const knex = require('knex')(require('../knexfile'));

function handlePlayCard(socket, card, io) {
  io.emit('cardPlayed', { player_uuid: socket.decoded.player_uuid, card });
}

module.exports = {
  handlePlayCard,
};

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

const genNormalDeck = (roomId) => {
  const cards = [];
  // General cards
  for (let i = 0; i < 4; i++) {
    cards.push({ card_id: 2, room_id: roomId, player_id: null }); // Git Cherry-Pick
    cards.push({ card_id: 3, room_id: roomId, player_id: null }); // Git Blame
    cards.push({ card_id: 4, room_id: roomId, player_id: null }); // Git Ignore
    cards.push({ card_id: 5, room_id: roomId, player_id: null }); // Git Stash
    cards.push({ card_id: 6, room_id: roomId, player_id: null }); // Git Merge
  }

  return cards;
};

const genBugAndResetCards = (roomId, players) => {
  const cards = [];
  // Give each a Reset
  for (const player of players) {
    cards.push({ card_id: 1, room_id: roomId, player_id: player.id }); //'Reset'
  }

  // Create the bugs for players -1 // Only one survive
  for (let i = 0; i < players.length - 1; i++) {
    cards.push({ card_id: 7, room_id: roomId, player_id: null }); //'Bug'
  }

  return cards;
};

module.exports = {
  genNormalDeck,
  genBugAndResetCards,
};

const knex = require('knex')(require('../../knexfile'));

const createNewGame = async (roomUUID) => {
  // console.log(deck);
  // give each playr 7 cards rndom
  //  draw cards
  //
  try {
    const players = await getAllPlayers(roomUUID);
    const deck = await createDeck(players[0].room_id, players.length);
    console.log(deck);
  } catch (error) {
    console.error(error);
    return new Error('Unable to create Game');
  }
};
const getAllPlayers = async (roomUUID) => {
  try {
    const players = await knex('rooms')
      .join('players', 'players.room_id', 'rooms.id')
      .where('rooms.uuid  ', roomUUID)
      .select(
        'rooms.id as room_id',
        'rooms.uuid as room_uuid',
        'players.uuid as player_uuid',
        'players.username as username'
      );

    return players;
  } catch (error) {
    console.error(error);
    return new Error('Cant fetch players');
  }
};

const createDeck = async (roomId, numberOfPlayers) => {
  try {
    const cards = normalDeckCards(roomId, numberOfPlayers);
    console.log(cards);
    const result = await knex('room_cards').insert(cards);

    return result;
  } catch (error) {
    console.error(error);
    return new Error('Cant fetch players');
  }
};

const normalDeckCards = (roomId, numberOfPlayers) => {
  const cards = [];
  for (let i = 0; i < numberOfPlayers - 1; i++) {
    cards.push({ card_id: 7, room_id: roomId, player_id: null }); //'Bug'
  }
  for (let i = 0; i < numberOfPlayers; i++) {
    cards.push({ card_id: 1, room_id: roomId, player_id: null }); //'Reset'
  }
  for (let i = 0; i < 4; i++) {
    cards.push({ card_id: 2, room_id: roomId, player_id: null }); //'Git Cherry-Pick'
    cards.push({ card_id: 3, room_id: roomId, player_id: null }); //'Git Blame'
    cards.push({ card_id: 4, room_id: roomId, player_id: null }); //'Git Ignore'
    cards.push({ card_id: 5, room_id: roomId, player_id: null }); //'Git Stash'
    cards.push({ card_id: 6, room_id: roomId, player_id: null }); //'Git Merge'
  }

  return cards;
};

module.exports = {
  createNewGame,
};

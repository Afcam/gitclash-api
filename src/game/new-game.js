const { genNormalDeck, genBugAndResetCards } = require('./game');

const knex = require('knex')(require('../../knexfile'));

const createNewGame = async (roomUUID) => {
  try {
    // Get all player for the Room
    const players = await knex('rooms')
      .join('players', 'players.room_id', 'rooms.id')
      .where('rooms.uuid  ', roomUUID)
      .select(
        'rooms.id as room_id',
        'rooms.uuid as room_uuid',
        'players.id as id',
        'players.uuid as player_uuid',
        'players.username as username'
      );
    const dbRoomId = players[0].room_id;

    // Clean old cards
    await knex('room_cards').del().where('room_id', dbRoomId);

    // Populate with normal cards
    const cards = genNormalDeck(dbRoomId);
    await knex('room_cards').insert(cards);

    // Draw normal cards for each player
    const initialNumberCards = 4;
    for (const player of players) {
      for (let i = 0; i < initialNumberCards; i++) {
        await drawCard(player.room_id, player.id);
      }
    }

    // generates Bug cards and give reset cards for each player
    const bugs = genBugAndResetCards(dbRoomId, players);
    await knex('room_cards').insert(bugs);

    return;
  } catch (error) {
    console.error(error);
    return new Error('Unable to create Game');
  }
};

const drawCard = async (roomId, playerId) => {
  try {
    const cards = await knex('room_cards')
      .where('room_id', roomId)
      .where('player_id', null)
      .select('id', 'card_id');

    const rand = Math.floor(Math.random() * cards.length);

    const newCard = await knex('room_cards')
      .where('id', cards[rand].id)
      .update('player_id', playerId);

    return newCard;
  } catch (error) {
    console.error(error);
    return new Error('Unable to Draw Cards');
  }
};

module.exports = {
  createNewGame,
  drawCard,
};

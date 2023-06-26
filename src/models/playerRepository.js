const knex = require('knex')(require('../../knexfile'));

async function fetchPlayers(roomUUID) {
  try {
    const players = await knex('rooms')
      .join('players', 'players.room_id', 'rooms.id')
      .where('rooms.uuid', roomUUID)
      .select(
        'players.uuid as player_uuid',
        'players.username',
        'players.avatar',
        'players.online'
      );

    return players;
  } catch (error) {
    throw new Error('Failed to fetch players from the database');
  }
}

async function updatePlayerOnlineStatus(playerUUID, online) {
  try {
    await knex('players').where('players.uuid', playerUUID).update('online', online);
  } catch (error) {
    throw new Error('Failed to update player online status in the database');
  }
}

module.exports = {
  fetchPlayers,
  updatePlayerOnlineStatus,
};

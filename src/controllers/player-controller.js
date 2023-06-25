const { createNewGame } = require('../game/new-game');

const knex = require('knex')(require('../../knexfile'));

const info = async (req, res) => {
  try {
    const player = await knex('players')
      .join('rooms', 'rooms.id', 'players.room_id')
      .where('players.uuid', req.decoded.player_uuid)
      .select(
        'players.uuid as player_uuid',
        'rooms.uuid as room_uuid',
        'players.username as username'
      )
      .limit(1);

    return res.status(200).json(player[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to join room');
  }
};

const start = async (req, res) => {
  try {
    console.log(req.decoded);
    createNewGame(req.decoded.room_uuid);

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to join room');
  }
};

module.exports = {
  info,
  start,
};

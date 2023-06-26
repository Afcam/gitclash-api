const knex = require('knex')(require('../../knexfile'));
const jwt = require('jsonwebtoken');
const { createPlayerUUID, createRoomUUID } = require('../utils/uuid');

const create = async (req, res, next) => {
  try {
    const roomUUID = createRoomUUID();
    await knex('rooms').insert({
      uuid: roomUUID,
      max_players: 10,
    });

    req.body.room_uuid = roomUUID;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to create room');
  }
};

const join = async (req, res) => {
  try {
    const roomUUID = req.body.room_uuid;

    if (!roomUUID) {
      return res.status(400).send('Join requires a room uuid');
    }

    // Gets the room id
    const room = await knex('rooms').where({ uuid: roomUUID });
    if (room.length === 0) {
      return res.status(400).send('Room uuid does not exist');
    }

    // Creates the new player in the db
    const playerUUID = createPlayerUUID();
    const result = await knex('players').insert({
      room_id: room[0].id,
      uuid: playerUUID,
      username: req.body.username,
      avatar: req.body.avatar,
    });

    if (result.length === 0) {
      return res.status(400).send('Failed to create new player');
    }

    const newPlayer = await knex('players')
      .join('rooms', 'rooms.id', 'players.room_id')
      .select('players.uuid as player_uuid', 'rooms.uuid as room_uuid')
      .where('players.id', result[0])
      .limit(1);

    const token = jwt.sign(newPlayer[0], process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.status(201).json(token);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to join room');
  }
};

module.exports = {
  create,
  join,
};

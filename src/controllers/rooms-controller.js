const knex = require('knex')(require('../../knexfile'));
const jwt = require('jsonwebtoken');
const { createPlayerUUID, createRoomUUID } = require('../utils/uuid');

const getToken = (roomUUID, playerUUID) =>
  jwt.sign({ room_uuid: roomUUID, player_uuid: playerUUID }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

const join = async (req, res) => {
  const roomUUID = req.params.uuid;

  if (!roomUUID) {
    return res.status(400).send('Join requires a room uuid');
  }

  try {
    const room = await knex('rooms').where({ uuid: roomUUID });

    if (room.length === 0) {
      return res.status(400).send('Room uuid does not exist');
    }

    const playerUUID = createPlayerUUID();
    await knex('players').insert({
      room_id: room[0].id,
      name: playerUUID,
    });

    const token = getToken(roomUUID, playerUUID);

    return res.status(201).json(token);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to join room');
  }
};

const create = async (_req, res) => {
  try {
    const roomUUID = createRoomUUID();
    const roomId = await knex('rooms').insert({
      uuid: roomUUID,
      max_players: 10,
    });

    const playerUUID = createPlayerUUID();
    await knex('players').insert({
      room_id: roomId[0],
      name: playerUUID,
    });

    const token = getToken(roomUUID, playerUUID);

    return res.status(201).json(token);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to create room');
  }
};

module.exports = {
  join,
  create,
};

const knex = require('knex')(require('../../knexfile'));
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const genToken = (roomId) => jwt.sign({ roomId }, process.env.JWT_SECRET);

const join = async (req, res) => {
  const { room_id } = req.body;

  if (!room_id) {
    return res.status(400).json({
      message: 'Login requires a room id',
    });
  }

  try {
    const room = await knex('rooms').where({ id: room_id });

    if (room.length === 0) {
      return res.status(400).send('Room ID does not exist');
    }

    return res.status(201).json(genToken(room_id));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to join room');
  }
};

const create = async (_req, res) => {
  try {
    const uuid = await nanoid(4);
    const result = await knex('rooms').insert({
      uuid: uuid,
      max_players: 10,
    });
    const newRoom = await knex('rooms').where({ id: result[0] });

    return res.status(201).json(genToken(newRoom[0].uuid));
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to create room');
  }
};

module.exports = {
  join,
  create,
};

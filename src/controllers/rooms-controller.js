const knex = require('knex')(require('../../knexfile'));
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
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

    const token = jwt.sign({ roomId: room_id }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
  }
};

const signup = async (req, res) => {
  try {
    res.status(200).json('nice');
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  login,
  signup,
};

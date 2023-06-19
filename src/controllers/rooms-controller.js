const knex = require('knex')(require('../knexfile'));

const login = async (req, res) => {
  try {
    res.status(200).json('nice');
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

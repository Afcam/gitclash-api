const { nanoid, customAlphabet } = require('nanoid');

const alphabet = '1234567890';
const length = 7;

const createRoomUUID = async () => await customAlphabet(alphabet, length)();

const createPlayerUUID = async () => await nanoid();

module.exports = {
  createRoomUUID,
  createPlayerUUID,
};

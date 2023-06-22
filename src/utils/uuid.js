const { nanoid, customAlphabet } = require('nanoid');

const alphabet = '1234567890';
const length = 7;

const createRoomUUID = () => customAlphabet(alphabet, length)();

const createPlayerUUID = () => nanoid();

module.exports = {
  createRoomUUID,
  createPlayerUUID,
};

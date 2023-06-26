const router = require('express').Router();
const roomsController = require('../controllers/rooms-controller');

router.route('/create').post(roomsController.create, roomsController.join);

router.route('/join').post(roomsController.join);

module.exports = router;

const router = require('express').Router();
const roomsController = require('../controllers/rooms-controller');

router.route('/join').post(roomsController.join);

router.route('/create').post(roomsController.create);

module.exports = router;

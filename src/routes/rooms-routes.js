const router = require('express').Router();
const roomsController = require('../controllers/rooms-controller');

router.route('/login').post(roomsController.login);

router.route('/signup').post(roomsController.signup);

module.exports = router;

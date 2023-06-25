const router = require('express').Router();
const playerController = require('../controllers/player-controller');

router.route('/').get(playerController.info);
router.route('/start').get(playerController.start);

module.exports = router;

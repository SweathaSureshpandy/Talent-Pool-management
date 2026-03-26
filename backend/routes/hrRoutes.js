const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');

router.get('/stats/:hr_id', hrController.getHrStats);
router.get('/profile/:user_id', hrController.getHrProfile);

module.exports = router;

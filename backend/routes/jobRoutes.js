const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/create', jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/recommended', jobController.getRecommendedJobs);

module.exports = router;

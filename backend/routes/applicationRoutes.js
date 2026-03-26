const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/apply', applicationController.applyForJob);
router.get('/student/:student_id', applicationController.getApplicationsByStudent);
router.get('/hr/:hr_id', applicationController.getApplicationsByHr);

module.exports = router;

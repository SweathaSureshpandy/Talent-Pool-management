const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

router.get('/', assessmentController.getAssessments);
router.get('/:id', assessmentController.getAssessmentById);
router.post('/submit', assessmentController.submitAssessment);
router.get('/student/:student_id', assessmentController.getResultsByStudent);

module.exports = router;

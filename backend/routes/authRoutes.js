const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get Profile
router.get('/profile/:role/:user_id', authController.getProfile);

// Student Skills & Resume
router.post('/profile/student/add-skill', authController.addSkill);
router.post('/profile/student/update-resume', authController.updateResume);
router.post('/profile/student/upload-resume', upload.single('resume'), authController.uploadResume);
router.put('/profile/student/:student_id/status', authController.updateStudentStatus);

module.exports = router;
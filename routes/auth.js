const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { registerValidator, loginValidator, updateUserValidator } = require('../middleware/authValidator');

// POST /api/auth/register - Register User Baru
router.post('/register', registerValidator, authController.register);

// POST /api/auth/login - Login user
router.post('/login', loginValidator, authController.login);

// GET /api/auth/profile - Dapatkan profil user (dilindungi)
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /api/auth/profile - Perbarui profil user (dilindungi)
router.put('/profile', authenticateToken, updateProfileValidator, authController.updateProfile);

module.exports = router; 
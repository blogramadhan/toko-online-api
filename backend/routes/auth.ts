import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/authValidator';

// POST /api/auth/register - Register User Baru
router.post('/register', registerValidator, authController.register);

// POST /api/auth/login - Login user
router.post('/login', loginValidator, authController.login);

// GET /api/auth/profile - Dapatkan profil user (dilindungi)
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /api/auth/profile - Perbarui profil user (dilindungi)
router.put('/profile', authenticateToken, updateProfileValidator, authController.updateProfile);

export default router; 
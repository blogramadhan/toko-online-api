import express from 'express';
const router = express.Router();
import * as cartController from '../controllers/cartController';
import { authenticateToken, requireUser } from '../middleware/auth';
import { addToCartValidator, updateCartItemValidator, cartItemIdValidator } from '../validators/cartValidator';

// GET /api/cart - Dapatkan keranjang aktif user
router.get('/', authenticateToken, requireUser, cartController.getCart);

// POST /api/cart/add - Tambahkan item ke keranjang
router.post('/add', authenticateToken, requireUser, addToCartValidator, cartController.addToCart);

// PUT /api/cart/items/:itemId - Perbarui jumlah item keranjang
router.put('/items/:itemId', authenticateToken, requireUser, updateCartItemValidator, cartController.updateCartItem);

// DELETE /api/cart/items/:itemId - Hapus item dari keranjang
router.delete('/items/:itemId', authenticateToken, requireUser, cartItemIdValidator, cartController.removeFromCart);

// DELETE /api/cart/clear - Hapus semua item dari keranjang
router.delete('/clear', authenticateToken, requireUser, cartController.clearCart);

export default router; 
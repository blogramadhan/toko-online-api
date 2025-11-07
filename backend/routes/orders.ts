import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/orderController';
import { authenticateToken, requireUser, requireAdmin } from '../middleware/auth';
import { createOrderValidator, updateOrderStatusValidator, orderIdValidator } from '../validators/orderValidator';

// User routes
// POST /api/orders - Buat order (checkout)
router.post('/', authenticateToken, requireUser, createOrderValidator, orderController.createOrder);

// GET /api/orders - Dapatkan order user
router.get('/', authenticateToken, requireUser, orderController.getUserOrders);

// GET /api/orders/:id - Dapatkan order tunggal
router.get('/:id', authenticateToken, orderIdValidator, orderController.getOrderById);

// PUT /api/orders/:id/cancel - Membatalkan order
router.put('/:id/cancel', authenticateToken, orderIdValidator, orderController.cancelOrder);

// Admin routes
// GET /api/orders/admin/all - Dapatkan semua order (admin only)
router.get('/admin/all', authenticateToken, requireAdmin, orderController.getAllOrders);

// PUT /api/orders/:id/status - Perbarui status order (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatusValidator, orderController.updateOrderStatus);

export default router; 
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, requireUser, requireAdmin } = require('../middleware/auth');
const { createOrderValidator, updateOrderStatusValidator, orderIdValidator } = require('../validators/orderValidator');

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

module.exports = router; 
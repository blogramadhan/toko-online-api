const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { createProductValidator, updateProductValidator, productIdValidator } = require('../validators/productValidator');

// GET /api/products - Dapatkan semua produk aktif (publik)
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Dapatkan produk tunggal (publik)
router.get('/:id', productIdValidator, productController.getProductById);

// Admin-only routes
// GET /api/products/admin/all - Dapatkan semua produk termasuk yang tidak aktif (admin only)
router.get('/admin/all', authenticateToken, requireAdmin, productController.getAdminProducts);

// POST /api/products - Buat produk baru (admin only)
router.post('/', authenticateToken, requireAdmin, createProductValidator, productController.createProduct);

// PUT /api/products/:id - Perbarui produk (admin only)
router.put('/:id', authenticateToken, requireAdmin, updateProductValidator, productController.updateProduct);

// DELETE /api/products/:id - Hapus produk (admin only)
router.delete('/:id', authenticateToken, requireAdmin, productIdValidator, productController.deleteProduct);

module.exports = router; 
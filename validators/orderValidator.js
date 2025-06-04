const { body, param } = require('express-validator');

const createOrderValidator = [
    body('shippingAddress')
        .trim()
        .notEmpty()
        .withMessage('Alamat pengiriman tidak boleh kosong')
        .isLength({ min: 10, max: 500 })
        .withMessage('Alamat pengiriman harus antara 10-500 karakter'),
    
    body('paymentMethod')
        .optional()
        .trim()
        .isIn(['COD', 'Transfer Bank', 'E-Wallet', 'Credit Card'])
        .withMessage('Metode pembayaran tidak valid')
];

const updateOrderStatusValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Order ID harus berupa angka positif'),
        
    body('status')
        .optional()
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Status order tidak valid'),
    
    body('paymentStatus')
        .optional()
        .isIn(['pending', 'paid', 'failed'])
        .withMessage('Status pembayaran tidak valid')
];

const orderIdValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Order ID harus berupa angka positif')
];

module.exports = {
    createOrderValidator,
    updateOrderStatusValidator,
    orderIdValidator
}; 
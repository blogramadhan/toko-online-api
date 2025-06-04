const { body, param } = require('express-validator');

const addToCartValidator = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID tidak boleh kosong')
        .isInt({ min: 1 })
        .withMessage('Product ID harus berupa angka positif'),
    
    body('quantity')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Quantity harus antara 1-100')
];

const updateCartItemValidator = [
    param('itemId')
        .isInt({ min: 1 })
        .withMessage('Item ID harus berupa angka positif'),
        
    body('quantity')
        .notEmpty()
        .withMessage('Quantity tidak boleh kosong')
        .isInt({ min: 1, max: 100 })
        .withMessage('Quantity harus antara 1-100')
];

const cartItemIdValidator = [
    param('itemId')
        .isInt({ min: 1 })
        .withMessage('Item ID harus berupa angka positif')
];

module.exports = {
    addToCartValidator,
    updateCartItemValidator,
    cartItemIdValidator
}; 
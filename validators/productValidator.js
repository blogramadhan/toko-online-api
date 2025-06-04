const { body, param } = require('express-validator');

const createProductValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Nama produk tidak boleh kosong')
        .isLength({ min: 2, max: 200 })
        .withMessage('Nama produk harus antara 2-200 karakter'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Deskripsi maksimal 1000 karakter'),
    
    body('price')
        .notEmpty()
        .withMessage('Harga tidak boleh kosong')
        .isFloat({ min: 0 })
        .withMessage('Harga harus berupa angka positif'),
    
    body('stock')
        .notEmpty()
        .withMessage('Stock tidak boleh kosong')
        .isInt({ min: 0 })
        .withMessage('Stock harus berupa angka bulat positif'),
    
    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Kategori maksimal 100 karakter'),
    
    body('image')
        .optional()
        .trim()
        .isURL()
        .withMessage('Image harus berupa URL yang valid')
];

const updateProductValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID produk harus berupa angka positif'),
        
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Nama produk tidak boleh kosong')
        .isLength({ min: 2, max: 200 })
        .withMessage('Nama produk harus antara 2-200 karakter'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Deskripsi maksimal 1000 karakter'),
    
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Harga harus berupa angka positif'),
    
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock harus berupa angka bulat positif'),
    
    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Kategori maksimal 100 karakter'),
    
    body('image')
        .optional()
        .trim()
        .isURL()
        .withMessage('Image harus berupa URL yang valid'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive harus berupa boolean')
];

const productIdValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID produk harus berupa angka positif')
];

module.exports = {
    createProductValidator,
    updateProductValidator,
    productIdValidator
}; 
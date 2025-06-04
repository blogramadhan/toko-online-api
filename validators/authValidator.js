const { body } = require('express-validator');

const registerValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Nama tidak boleh kosong')
        .isLength({ min: 2, max: 100 })
        .withMessage('Nama harus antara 2-100 karakter'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email tidak boleh kosong')
        .isEmail()
        .withMessage('Format email tidak valid')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password minimal 6 karakter')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password harus mengandung huruf kecil, huruf besar, dan angka'),
    
    body('phone')
        .optional()
        .isMobilePhone('id-ID')
        .withMessage('Format nomor telepon tidak valid'),
    
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Alamat maksimal 500 karakter'),
    
    body('role')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('Role harus admin atau user')
];

const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email tidak boleh kosong')
        .isEmail()
        .withMessage('Format email tidak valid')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
];

const updateProfileValidator = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Nama tidak boleh kosong')
        .isLength({ min: 2, max: 100 })
        .withMessage('Nama harus antara 2-100 karakter'),
    
    body('phone')
        .optional()
        .isMobilePhone('id-ID')
        .withMessage('Format nomor telepon tidak valid'),
    
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Alamat maksimal 500 karakter')
];

module.exports = {
    registerValidator,
    loginValidator,
    updateProfileValidator
}; 
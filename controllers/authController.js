const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { User } = require("../models");

// Buat Token JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

// Daftar User
const register = async (req, res) => {
    try {
        // Cek Validasi
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validasi Gagal', errors: errors.array() });
        }

        const { name, email, password, phone, address, role } = req.body;

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
        }

        // Buat User Baru
        const user = await User.create({
            name, email, password, phone, address, role: role || 'user'
        });
        
        // Buat Token JWT
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'User berhasil didaftarkan',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    address: user.address
                },
                token
            }
        });

    } catch (error) {
        console.error('Error saat registrasi:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat registrasi', error: error.message });
    }
};

// Login User
const login = async (req, res) => {
    try {
        // Cek Validasi
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validasi Gagal', errors: errors.array() });
        }

        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }

        // Cek password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }

        // Buat Token JWT
        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token
            }
        })
        
    } catch (error) {
        console.error('Error saat login:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login', error: error.message });
    }
};

// Informasi Profile User
const getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            data: { user: req.user }
        });

    } catch (error) {
        console.error('Error saat mendapatkan profil:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mendapatkan profil', error: error.message });
    }
};

// Update Profile User
const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validasi Gagal', errors: errors.array() });
        }

        const { name, phone, address } = req.body;
        const userId = req.user.id;

        await User.update({ name, phone, address }, { where: { id: userId } });
        
        const updatedUser = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
        
        res.json({ success: true, message: 'Profil berhasil diupdate', data: { user: updatedUser } });

    } catch (error) {
        console.error('Error saat mengupdate profil:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengupdate profil', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};


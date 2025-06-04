const { validationResult } = require("express-validator");
const { Product } = require("../models");
const { Op } = require("sequelize");

// Ambil semua produk (Publik - untuk pembeli dan admin)
const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = { isActive: true };

        // Filter berdasarkan search
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Filter berdasarkan kategori
        if (category) {
            whereClause.category = category;
        }

        // Filter berdasarkan harga
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = minPrice;
            if (maxPrice) whereClause.price[Op.lte] = maxPrice;
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]]
        });

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error saat mengambil semua produk:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua produk',
            error: error.message
        });
    }
};

// Ambil satu produk berdasarkan ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: {
                product
            }
        });

    } catch (error) {
        console.error('Error saat mengambil produk berdasarkan ID:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil produk berdasarkan ID',
            error: error.message
        });
    }
};

// Buat produk baru (Hanya untuk admin)
const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors: errors.array()
            });
        }
  
        const { name, description, price, stock, category, image } = req.body;
  
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            image
        });
  
        res.status(201).json({
            success: true,
            message: 'Produk berhasil dibuat',
            data: {
                product
            }
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat membuat produk:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat produk',
            error: error.message
        });
    }
};

// Update produk (Hanya untuk admin)
const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { name, description, price, stock, category, image, isActive } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        await product.update({
            name,
            description,
            price,
            stock,
            category,
            image,
            isActive
        });

        res.json({
            success: true,
            message: 'Produk berhasil diupdate',
            data: {
                product
            }
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate produk:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate produk',
            error: error.message
        });
    }
};

// Hapus Produk (Hanya untuk admin)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        // Hapus Produk (soft delete - set isActive menjadi false)
        await product.update({ isActive: false });

        res.json({
            success: true,
            message: 'Produk berhasil dihapus'
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat menghapus produk:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus produk',
            error: error.message
        });
    }
};

// Ambil semua produk (Admin - termasuk yang dihapus)
const getAdminProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            isActive,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        // Filter berdasarkan search
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Filter berdasarkan Category
        if (category) {
            whereClause.category = category;
        }

        // FIlter berdasarkan status
        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]]
        });

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil semua produk (Admin) :', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua produk (Admin)',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAdminProducts
};
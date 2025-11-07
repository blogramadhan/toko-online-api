import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Product } from "../models";
import { Op } from "sequelize";

// Ambil semua produk (Publik - untuk pembeli dan admin)
const getAllProducts = async (req: Request, res: Response): Promise<any> => {
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

        const offset = (Number(page) - 1) * Number(limit);
        const whereClause: any = { isActive: true };

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
            limit: parseInt(String(limit)),
            offset: parseInt(String(offset)),
            order: [[String(sortBy), String(sortOrder)]]
        });

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: parseInt(String(page)),
                    totalPages: Math.ceil(count / Number(limit)),
                    totalItems: count,
                    itemsPerPage: parseInt(String(limit))
                }
            }
        });

    } catch (error) {
        console.error('Error saat mengambil semua produk:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua produk',
            error: errorMessage
        });
    }
};

// Ambil satu produk berdasarkan ID
const getProductById = async (req: Request, res: Response): Promise<any> => {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil produk berdasarkan ID',
            error: errorMessage
        });
    }
};

// Buat produk baru (Hanya untuk admin)
const createProduct = async (req: Request, res: Response): Promise<any> => {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat produk',
            error: errorMessage
        });
    }
};

// Update produk (Hanya untuk admin)
const updateProduct = async (req: Request, res: Response): Promise<any> => {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate produk',
            error: errorMessage
        });
    }
};

// Hapus Produk (Hanya untuk admin)
const deleteProduct = async (req: Request, res: Response): Promise<any> => {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus produk',
            error: errorMessage
        });
    }
};

// Ambil semua produk (Admin - termasuk yang dihapus)
const getAdminProducts = async (req: Request, res: Response): Promise<any> => {
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

        const offset = (Number(page) - 1) * Number(limit);
        const whereClause: any = {};

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
            limit: parseInt(String(limit)),
            offset: parseInt(String(offset)),
            order: [[String(sortBy), String(sortOrder)]]
        });

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: parseInt(String(page)),
                    totalPages: Math.ceil(count / Number(limit)),
                    totalItems: count,
                    itemsPerPage: parseInt(String(limit))
                }
            }
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil semua produk (Admin) :', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua produk (Admin)',
            error: errorMessage
        });
    }
};

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAdminProducts
};
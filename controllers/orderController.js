const { validationResult } = require('express-validator');
const { Order, OrderItem, Cart, CartItem, Product, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Membuat Nomor Order
const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
};

// Buat Order (Checkout)
const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors: errors.array()
            });
        }

        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user.id;

        // Cari keranjang aktif user
        const cart = await Cart.findOne({
            where: { userId, status: 'active' },
            include: [
                {
                model: CartItem,
                as: 'items',
                include: [
                    {
                    model: Product,
                    as: 'product'
                    }
                ]
                }
            ],
            transaction
        });

        if (!cart || !cart.items || cart.items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart kosong'
            });
        }

        // Validasi stok untuk semua item
        for (const item of cart.items) {
            if (!item.product.isActive) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Produk ${item.product.name} tidak tersedia`
                });
            }

            if (item.product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Stock ${item.product.name} tidak mencukupi`
                });
            }
        }

        // Buat order
        const orderNumber = generateOrderNumber();
        const order = await Order.create({
            orderNumber,
            userId,
            totalAmount: cart.totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD'
        }, { transaction });

        // Buat item order dan update stok
        for (const item of cart.items) {
            // Buat item order
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                productName: item.product.name
            }, { transaction });

        // Perbarui stok produk
        await Product.update(
            { stock: item.product.stock - item.quantity },
            { where: { id: item.productId }, transaction }
        );
    }

    // Update status keranjang menjadi completed
    await cart.update({ status: 'completed' }, { transaction });

    await transaction.commit();

    // Dapatkan order yang sudah dibuat beserta item-itemnya
    const createdOrder = await Order.findByPk(order.id, {
        include: [
            {
                model: OrderItem,
                as: 'items'
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            }
        ]
    });

    res.status(201).json({
        success: true,
        message: 'Order berhasil dibuat',
        data: {
            order: createdOrder
        }
    });

    } catch (error) {
        await transaction.rollback();
        console.error('Terjadi kesalahan saat membuat order:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat order',
            error: error.message
        });
    }
};

// Get User Orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { userId };
        if (status) {
            whereClause.status = status;
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                model: OrderItem,
                as: 'items'
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil order user:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil order user',
            error: error.message
        });
    }
};

// Dapatkan Order berdasarkan ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const whereClause = { id };
        
        // Jika bukan admin, hanya bisa melihat order sendiri
        if (userRole !== 'admin') {
            whereClause.userId = userId;
        }

        const order = await Order.findOne({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    as: 'items'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: {
                order
            }
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil order berdasarkan ID:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil order berdasarkan ID',
            error: error.message
        });
    }
};

// Update Order Status (Admin Only)
const updateOrderStatus = async (req, res) => {
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
        const { status, paymentStatus } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan'
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        await order.update(updateData);

        const updatedOrder = await Order.findByPk(id, {
            include: [
                {
                    model: OrderItem,
                    as: 'items'
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.json({
            success: true,
            message: 'Status order berhasil diupdate',
            data: {
                order: updatedOrder
            }
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengupdate status order:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate status order',
            error: error.message
        });
    }
};

// Mendapatkan Semua Order (Khusus Admin)
const getAllOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            paymentStatus,
            search,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        if (status) whereClause.status = status;
        if (paymentStatus) whereClause.paymentStatus = paymentStatus;

        const includeClause = [
            {
                model: OrderItem,
                as: 'items'
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'phone']
            }
        ];

        // Cari berdasarkan nomor order atau nama pengguna
        if (search) {
            whereClause[Op.or] = [
                { orderNumber: { [Op.like]: `%${search}%` } },
                { '$user.name$': { [Op.like]: `%${search}%` } },
                { '$user.email$': { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: includeClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]],
            distinct: true
        });

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil semua order:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua order',
            error: error.message
        });
    }
};

// Membatalkan Order
const cancelOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const whereClause = { id };
        
        // Jika bukan admin, hanya bisa membatalkan order sendiri
        if (userRole !== 'admin') {
            whereClause.userId = userId;
        }

        const order = await Order.findOne({
            where: whereClause,
            include: [
                {
                    model: OrderItem,
                    as: 'items'
                }
            ],
            transaction
        });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Order tidak ditemukan'
            });
        }

        // Cek apakah order bisa di-cancel
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Order tidak dapat dibatalkan'
            });
        }

        // Return stock untuk semua items
        for (const item of order.items) {
            await Product.increment('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction
            });
        }

        // Update status order
        await order.update({ status: 'cancelled' }, { transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: 'Order berhasil dibatalkan'
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Terjadi kesalahan saat membatalkan order:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membatalkan order',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    cancelOrder
}; 
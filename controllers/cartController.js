const { validationResult } = require("express-validator");
const { Cart, CartItem, Product, sequelize } = require("../models");

// Ambil keranjang user yang sedang aktif
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
  
        let cart = await Cart.findOne({
            where: { userId, status: 'active' },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'price', 'stock', 'image', 'isActive']
                        }
                    ]
                }
            ]
        });
  
        // Jika cart belum ada, buat cart baru
        if (!cart) {
            cart = await Cart.create({ userId });
            cart.items = [];
        }
  
        // Hitung total amount
        let totalAmount = 0;
        if (cart.items) {
            totalAmount = cart.items.reduce((sum, item) => {
                return sum + (parseFloat(item.price) * item.quantity);
            }, 0);
    
            // Update total amount di database
            await cart.update({ totalAmount });
        }
  
        res.json({
            success: true,
            data: {
            cart: {
                ...cart.toJSON(),
                totalAmount
            }
            }
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat mengambil keranjang:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil keranjang',
            error: error.message
        });
    }
};

// Tambahkan produk ke keranjang
const addToCart = async (req, res) => {
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
  
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;
  
        // Cek apakah produk ada dan aktif
        const product = await Product.findOne({
            where: { id: productId, isActive: true }
        });
    
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }
  
        // Cek stock
        if (product.stock < quantity) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Stok tidak mencukupi'
            });
        }
  
        // Dapatkan atau buat cart aktif
        let cart = await Cart.findOne({
            where: { userId, status: 'active' },
            transaction
        });
  
        if (!cart) {
            cart = await Cart.create({ userId }, { transaction });
        }
  
        // Cek apakah item sudah ada di cart
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId },
            transaction
        });
  
        if (cartItem) {
            // Update quantity jika item sudah ada
            const newQuantity = cartItem.quantity + quantity;
            
            if (product.stock < newQuantity) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Stock tidak mencukupi untuk jumlah yang diminta'
            });
            }
    
            await cartItem.update({
                quantity: newQuantity,
                price: product.price
            }, { transaction });
        } else {
            // Tambah item baru ke cart
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
                price: product.price
            }, { transaction });
        }
  
        // Update total amount cart
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            transaction
        });
    
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);
  
        await cart.update({ totalAmount }, { transaction });
    
        await transaction.commit();
  
        // Dapatkan cart yang sudah diperbarui beserta item-itemnya
        const updatedCart = await Cart.findByPk(cart.id, {
            include: [
            {
                model: CartItem,
                as: 'items',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'price', 'stock', 'image']
                    }
                ]
            }
            ]
        });
  
        res.json({
            success: true,
            message: 'Produk berhasil ditambahkan ke keranjang',
            data: {
                cart: updatedCart
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Terjadi kesalahan saat menambahkan ke keranjang:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan ke keranjang',
            error: error.message
        });
    }
};

// Update Jumlah Item Keranjang
const updateCartItem = async (req, res) => {
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
  
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;
  
        // Find cart item
        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
                    as: 'cart',
                    where: { userId, status: 'active' }
                },
                {
                    model: Product,
                    as: 'product'
                }
            ],
            transaction
        });
  
        if (!cartItem) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Item keranjang tidak ditemukan'
            });
        }
  
        // Cek stock
        if (cartItem.product.stock < quantity) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Stok tidak mencukupi'
            });
        }
  
        // Perbarui jumlah
        await cartItem.update({ quantity }, { transaction });
  
        // Perbarui total jumlah keranjang
        const cartItems = await CartItem.findAll({
            where: { cartId: cartItem.cart.id },
            transaction
        });
  
        const totalAmount = cartItems.reduce((sum, item) => {
            const currentQuantity = item.id === cartItem.id ? quantity : item.quantity;
            return sum + (parseFloat(item.price) * currentQuantity);
        }, 0);
  
        await cartItem.cart.update({ totalAmount }, { transaction });
    
        await transaction.commit();
  
        // Dapatkan cart yang sudah diperbarui beserta item-itemnya
        const updatedCart = await Cart.findByPk(cartItem.cart.id, {
            include: [
            {
                model: CartItem,
                as: 'items',
                include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'stock', 'image']
                }
                ]
            }
            ]
        });
  
        res.json({
            success: true,
            message: 'Cart item berhasil diupdate',
            data: {
                cart: updatedCart
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Terjadi kesalahan saat mengupdate item keranjang:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate item keranjang',
            error: error.message
        });
    }
};
  
// Hapus Item dari Keranjang
const removeFromCart = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { itemId } = req.params;
        const userId = req.user.id;
    
        // Cari cart item
        const cartItem = await CartItem.findOne({
            where: { id: itemId },
            include: [
                {
                    model: Cart,
                    as: 'cart',
                    where: { userId, status: 'active' }
                }
            ],
            transaction
        });
  
        if (!cartItem) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Item keranjang tidak ditemukan'
            });
        }
  
        // Hapus item dari keranjang
        await cartItem.destroy({ transaction });
    
        // Perbarui jumlah total keranjang
        const remainingItems = await CartItem.findAll({
            where: { cartId: cartItem.cart.id },
            transaction
        });
  
        const totalAmount = remainingItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);
    
        await cartItem.cart.update({ totalAmount }, { transaction });
    
        await transaction.commit();
  
        // Dapatkan keranjang yang sudah diperbarui beserta item-itemnya
        const updatedCart = await Cart.findByPk(cartItem.cart.id, {
            include: [
            {
                model: CartItem,
                as: 'items',
                include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'stock', 'image']
                }
                ]
            }
            ]
        });
  
        res.json({
            success: true,
            message: 'Item berhasil dihapus dari cart',
                data: {
                cart: updatedCart
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Terjadi kesalahan saat menghapus item dari keranjang:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus item dari keranjang',
            error: error.message
        });
    }
};

// Clear Cart
const clearCart = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const userId = req.user.id;
    
        // Cari keranjang aktif
        const cart = await Cart.findOne({
            where: { userId, status: 'active' },
            transaction
        });
    
        if (!cart) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Keranjang tidak ditemukan'
            });
        }
  
        // Hapus semua items di keranjang
        await CartItem.destroy({
            where: { cartId: cart.id },
            transaction
        });
    
        // Atur ulang total jumlah
        await cart.update({ totalAmount: 0 }, { transaction });
    
        await transaction.commit();
    
        res.json({
            success: true,
            message: 'Keranjang berhasil dikosongkan',
            data: {
            cart: {
                ...cart.toJSON(),
                items: []
            }
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Terjadi kesalahan saat menghapus semua item dari keranjang:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus semua item dari keranjang',
            error: error.message
        });
    }
};
  
module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
}; 
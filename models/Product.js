module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [2, 200] } },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10,2), allowNull: false, validate: { min: 0 } },
        stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
        category: { type: DataTypes.STRING, allowNull: true },
        image: { type: DataTypes.STRING, allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },{
        tableName: 'products',
        timestamps: true,
    });

    Product.associate = function(models) {
        Product.hasMany(models.CartItem, { foreignKey: 'productId', as: 'cartItems' });
        Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' })
    };

    return Product;
}
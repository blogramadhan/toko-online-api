module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        cartId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'carts', key: 'id' } },
        productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'products', key: 'id' } },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 }},
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    },{
        tableName: 'cart_items',
        timestamps: true
    });

    CartItem.associate = function(models) {
        CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
        CartItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    };

    return CartItem;
};
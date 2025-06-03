module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
        status: { type: DataTypes.ENUM('active', 'completed', 'abandoned'), defaultValue: 'active' },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },   
    },{
        tableName: 'carts',
        timestamps: true,
    });

    Cart.associate = function(models) {
        Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
    };

    return Cart;
}
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
        shippingAddress: { type: DataTypes.TEXT, allowNull: false },
        paymentMethod: { type: DataTypes.STRING, allowNull: true },
        paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
    },{
        tableName: 'orders',
        timestamps: true,
    });

    Order.associate = function(models) {
        Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    };

    return Order;
}
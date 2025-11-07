import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface OrderAttributes {
    id: number;
    orderNumber: string;
    userId: number;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    paymentMethod?: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status' | 'paymentMethod' | 'paymentStatus'> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public orderNumber!: string;
    public userId!: number;
    public totalAmount!: number;
    public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    public shippingAddress!: string;
    public paymentMethod?: string;
    public paymentStatus!: 'pending' | 'paid' | 'failed';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Association properties
    public readonly items?: any[];

    public static associate(models: any): void {
        Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
    }
}

export default (sequelize: Sequelize): typeof Order => {
    Order.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
        userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
        shippingAddress: { type: DataTypes.TEXT, allowNull: false },
        paymentMethod: { type: DataTypes.STRING, allowNull: true },
        paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
    }, {
        sequelize,
        tableName: 'orders',
        timestamps: true,
    });

    return Order;
}